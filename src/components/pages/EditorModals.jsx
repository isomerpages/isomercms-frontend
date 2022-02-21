import HyperlinkModal from "components/HyperlinkModal"
import MediaModal from "components/media/MediaModal"
import PropTypes from "prop-types"

const EditorModals = ({ mdeRef, onSave, modalType, onClose, mediaType }) => {
  const onHyperlinkSave = (text, link) => {
    const cm = mdeRef.current.simpleMde.codemirror
    cm.replaceSelection(`[${text}](${link})`)
    // set state so that rerender is triggered and path is shown
    onSave(mdeRef.current.simpleMde.codemirror.getValue())
    onClose()
  }

  const onMediaSave = (data) => {
    const { selectedMediaPath, altText } = data
    const cm = mdeRef.current.simpleMde.codemirror
    if (mediaType === "files")
      cm.replaceSelection(
        `[${altText}](${selectedMediaPath.replaceAll(" ", "%20")})`
      )
    if (mediaType === "images")
      cm.replaceSelection(
        `![${altText}](${selectedMediaPath.replaceAll(" ", "%20")})`
      )
    // set state so that rerender is triggered and image is shown
    onSave(mdeRef.current.simpleMde.codemirror.getValue())
    onClose()
  }

  return (
    <>
      {modalType == "media" && mediaType && (
        <MediaModal
          onClose={onClose}
          type={mediaType}
          onProceed={onMediaSave}
          showAltTextModal
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
