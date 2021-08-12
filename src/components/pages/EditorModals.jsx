import React, { useState } from "react"
import PropTypes from "prop-types"

import HyperlinkModal from "../HyperlinkModal"
import MediaModal from "../media/MediaModal"
import MediaSettingsModal from "../media/MediaSettingsModal"

const MEDIA_PLACEHOLDER_TEXT = {
  images: "![Alt text for image on Isomer site]",
  files: "[Example Filename]",
}

const EditorModals = ({
  siteName,
  mdeRef,
  setEditorValue,
  modalType,
  setModalType,
  insertingMediaType,
  setInsertingMediaType,
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
    setEditorValue(mdeRef.current.simpleMde.codemirror.getValue())
    setModalType("")
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
      setEditorValue(mdeRef.current.simpleMde.codemirror.getValue())
    }
    setModalType("")
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
    setEditorValue(mdeRef.current.simpleMde.codemirror.getValue())
    setModalType("")
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
          onClose={() => {
            setModalType("")
            setInsertingMediaType("")
          }}
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
            setModalType("")
            setInsertingMediaType("")
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
          onClose={() => setModalType("")}
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
  setEditorValue: PropTypes.func,
  modalType: PropTypes.oneOf(["hyperlink", "media"]).isRequired,
  setModalType: PropTypes.func.isRequired,
  insertingMediaType: PropTypes.oneOf(["files", "images"]),
  setInsertingMediaType: PropTypes.func,
}

export default EditorModals
