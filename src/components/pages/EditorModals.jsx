import HyperlinkModal from "components/HyperlinkModal"
import MediaModal from "components/media/MediaModal"
import PropTypes from "prop-types"
import { useEffect, useState } from "react"

const EditorModals = ({
  // mdeRef,
  onSave,
  modalType,
  onClose,
  mediaType,
  simpleMde,
  lineAndCursor,
}) => {
  const [linePos, setLinePos] = useState({ line: 0, ch: 0, sticky: null })

  console.log(`Current linepos`, linePos)

  useEffect(() => {
    if (!lineAndCursor && simpleMde) {
      setLinePos(lineAndCursor)
      simpleMde.codemirror.setSelection(lineAndCursor)
    }
    if (lineAndCursor && lineAndCursor.line !== 0 && lineAndCursor.ch !== 0) {
      setLinePos(lineAndCursor)
    }
  }, [lineAndCursor])

  const onHyperlinkSave = (text, link) => {
    // const cm = mdeRef.current.simpleMde.codemirror
    const cm = simpleMde.codemirror
    cm.setCursor(linePos)
    cm.setSelection(linePos)
    cm.replaceSelection(`[${text}](${link})`)
    // set state so that rerender is triggered and path is shown
    // onSave(mdeRef.current.simpleMde.codemirror.getValue())
    onSave(simpleMde.codemirror.getValue())
    onClose()
  }

  // console.log(`MDE REF`, mdeRef)
  console.log(`Simple MDE`, simpleMde)
  console.log(`Line Cursor`, lineAndCursor)

  const onMediaSave = (data) => {
    const { selectedMediaPath, altText } = data
    console.log(`DATA`, data)
    // const cm = mdeRef.current.simpleMde.codemirror
    const cm = simpleMde.codemirror

    console.log(`Setting selection to `, lineAndCursor)
    cm.setCursor(linePos)
    cm.setSelection(linePos)

    console.log(`Current cursor`, cm.getCursor())

    console.log(`SELECTIONS`, cm.getSelections())
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
  // mdeRef: PropTypes.oneOfType([
  //   // https://stackoverflow.com/questions/48007326/what-is-the-correct-proptype-for-a-ref-in-react
  //   PropTypes.func,
  //   PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  // ]),
  onSave: PropTypes.func.isRequired,
  modalType: PropTypes.oneOf(["hyperlink", "media"]).isRequired,
  onClose: PropTypes.func.isRequired,
}

export default EditorModals
