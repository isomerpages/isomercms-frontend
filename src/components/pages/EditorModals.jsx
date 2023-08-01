import PropTypes from "prop-types"
import { useEffect, useState } from "react"

import HyperlinkModal from "components/HyperlinkModal"
import MediaModal from "components/media/MediaModal"

const EditorModals = ({
  onSave,
  modalType,
  onClose,
  mediaType,
  simpleMde,
  lineAndCursor,
}) => {
  const [linePos, setLinePos] = useState({ line: 0, ch: 0, sticky: null })

  // this fixes the issue where line and cursor are being reset to 0 upon opening modals
  useEffect(() => {
    if (!lineAndCursor && simpleMde) {
      setLinePos(lineAndCursor)
      simpleMde.codemirror.setSelection(lineAndCursor)
    }
    if (
      lineAndCursor &&
      !(lineAndCursor.line === 0 && lineAndCursor.ch === 0)
    ) {
      setLinePos(lineAndCursor)
    }
  }, [lineAndCursor])

  const onHyperlinkSave = (text, link) => {
    const cm = simpleMde.codemirror
    cm.setCursor(linePos)
    cm.setSelection(linePos)
    cm.replaceSelection(`[${text}](${link})`)
    // set state so that rerender is triggered and path is shown
    onSave(simpleMde.codemirror.getValue())
    onClose()
  }

  const onMediaSave = (data) => {
    const { selectedMediaPath, altText } = data
    const cm = simpleMde.codemirror

    cm.setCursor(linePos)
    cm.setSelection(linePos)

    if (mediaType === "files")
      cm.replaceSelection(
        `[${altText}](${selectedMediaPath.replaceAll(" ", "%20")})`
      )
    if (mediaType === "images") {
      cm.replaceSelection(
        `![${altText}](${selectedMediaPath.replaceAll(" ", "%20")})`
      )
    }
    // set state so that rerender is triggered and image is shown
    onSave(simpleMde.codemirror.getValue())
    onClose()
  }

  return (
    <>
      {modalType === "media" && mediaType && (
        <MediaModal
          onClose={onClose}
          type={mediaType}
          onProceed={onMediaSave}
          showAltTextModal
        />
      )}
      {modalType === "hyperlink" && (
        <HyperlinkModal
          text={simpleMde.codemirror.getSelection()}
          onSave={onHyperlinkSave}
          onClose={onClose}
        />
      )}
    </>
  )
}

EditorModals.propTypes = {
  onSave: PropTypes.func.isRequired,
  modalType: PropTypes.oneOf(["hyperlink", "media"]).isRequired,
  onClose: PropTypes.func.isRequired,
  simpleMde: PropTypes.shape({
    codemirror: PropTypes.shape({
      getSelection: PropTypes.func,
      getValue: PropTypes.func,
      replaceSelection: PropTypes.func,
      setCursor: PropTypes.func,
    }),
  }),
  lineAndCursor: PropTypes.shape({
    line: PropTypes.number,
    ch: PropTypes.number,
    sticky: PropTypes.string,
    xRel: PropTypes.number,
  }),
}

export default EditorModals
