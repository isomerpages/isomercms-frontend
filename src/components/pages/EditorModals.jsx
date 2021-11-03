import PropTypes from "prop-types"
import React, { useState } from "react"

import HyperlinkModal from "components/HyperlinkModal"
import MediaModal from "components/media/MediaModal"
import MediaSettingsModal from "components/media/MediaSettingsModal"

const MEDIA_PLACEHOLDER_TEXT = {
  images: "![Alt text for image on Isomer site]",
  files: "[Example Filename]",
}

const EditorModals = ({
  siteName,
  mdeRef,
  onSave,
  modalType,
  onClose,
  insertingMediaType,
}) => {
  const [isMediaUpload, setIsMediaUpload] = useState(false)
  const [stagedMediaDetails, setStagedMediaDetails] = useState({})
  const [uploadPath, setUploadPath] = useState("")

  /** ******************************** */
  /*         Hyperlink Modal         */
  /** ******************************** */

  const onHyperlinkSave = (text, link) => {
    const cm = mdeRef.current.simpleMde.codemirror
    cm.replaceSelection(`[${text}](${link})`)
    // set state so that rerender is triggered and path is shown
    onSave(mdeRef.current.simpleMde.codemirror.getValue())
    onClose()
  }

  /** ******************************** */
  /*           Media Modal           */
  /*   to be refactored with media   */
  /** ******************************** */

  const toggleMediaAndSettingsModal = (newFileName) => {
    const cm = mdeRef.current.simpleMde.codemirror
    if (newFileName) {
      cm.replaceSelection(
        `${
          MEDIA_PLACEHOLDER_TEXT[insertingMediaType]
        }${`(/${insertingMediaType}/${
          uploadPath ? `${uploadPath}/` : ""
        }${newFileName})`.replaceAll(" ", "%20")}`
      )
      // set state so that rerender is triggered and image is shown
      onSave(mdeRef.current.simpleMde.codemirror.getValue())
    }
    onClose()
    setIsMediaUpload(false)
  }

  const onMediaSelect = (path) => {
    const cm = mdeRef.current.simpleMde.codemirror
    cm.replaceSelection(
      `${MEDIA_PLACEHOLDER_TEXT[insertingMediaType]}(${path.replaceAll(
        " ",
        "%20"
      )})`
    )
    // set state so that rerender is triggered and image is shown
    onSave(mdeRef.current.simpleMde.codemirror.getValue())
    onClose()
  }

  const readMediaToStageUpload = async (event) => {
    const fileReader = new FileReader()
    const fileName = event.target.files[0].name
    fileReader.onload = () => {
      /** Github only requires the content of the image
       * fileReader returns  `data:application/pdf;base64, {fileContent}`
       * hence the split
       */
      const fileData = fileReader.result.split(",")[1]
      setStagedMediaDetails({
        path: `${insertingMediaType}%2F${fileName}`,
        content: fileData,
        fileName,
      })
    }
    fileReader.readAsDataURL(event.target.files[0])
    setIsMediaUpload(true)
  }

  return (
    <>
      {modalType == "media" && insertingMediaType && !isMediaUpload && (
        <MediaModal
          siteName={siteName}
          onClose={onClose}
          onMediaSelect={onMediaSelect}
          type={insertingMediaType}
          readFileToStageUpload={readMediaToStageUpload}
          setUploadPath={setUploadPath}
        />
      )}
      {modalType == "media" && insertingMediaType && isMediaUpload && (
        <MediaSettingsModal
          type={insertingMediaType}
          siteName={siteName}
          customPath={uploadPath}
          onClose={() => {
            onClose()
            setIsMediaUpload(false)
          }}
          onSave={toggleMediaAndSettingsModal}
          media={stagedMediaDetails}
          isPendingUpload
        />
      )}
      {modalType == "hyperlink" && (
        <HyperlinkModal
          text={mdeRef.current.simpleMde.codemirror.getSelection()}
          onSave={onHyperlinkSave}
          onClose={onClose}
        />
      )}
    </>
  )
}

EditorModals.propTypes = {
  siteName: PropTypes.string,
  mdeRef: PropTypes.oneOfType([
    // https://stackoverflow.com/questions/48007326/what-is-the-correct-proptype-for-a-ref-in-react
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  onSave: PropTypes.func.isRequired,
  modalType: PropTypes.oneOf(["hyperlink", "media"]).isRequired,
  onClose: PropTypes.func.isRequired,
  insertingMediaType: PropTypes.oneOf(["files", "images"]),
}

export default EditorModals
