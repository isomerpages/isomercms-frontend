import HyperlinkModal from "components/HyperlinkModal"
import InstagramModal, { InstagramModalTabs } from "components/InstagramModal"
import MediaModal from "components/media/MediaModal"
import PropTypes from "prop-types"

import {
  getInstagramEmbedTag,
  processInstagramEmbedToTag,
  INSTAGRAM_POST_URL_REGEX,
} from "utils"

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

  const onInstagramEmbedSave = (type, value) => {
    const cm = mdeRef.current.simpleMde.codemirror

    if (type === InstagramModalTabs.PostUrl) {
      // value should be of type { postUrl: string, isCaptioned: boolean }
      const { postUrl, isCaptioned } = value
      if (RegExp(INSTAGRAM_POST_URL_REGEX).test(postUrl)) {
        // postUrl is like https://www.instagram.com/p/ChBcfUHPbjb/
        // we need to extract the post ID (the segment after "/p/")
        const postId = postUrl.split("/p/")[1].split("/")[0]
        const embedTag = getInstagramEmbedTag(postId, isCaptioned)
        cm.replaceSelection(embedTag)
      }
    } else if (type === InstagramModalTabs.EmbedCode) {
      // value should be of type { embedCode: string }
      const { embedCode } = value
      const embedTag = processInstagramEmbedToTag(embedCode)
      cm.replaceSelection(embedTag)
    }

    // set state so that rerender is triggered and image is shown
    onSave(mdeRef.current.simpleMde.codemirror.getValue())
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
          text={mdeRef.current.simpleMde.codemirror.getSelection()}
          onSave={onHyperlinkSave}
          onClose={onClose}
        />
      )}
      {modalType === "instagram" && (
        <InstagramModal onSave={onInstagramEmbedSave} onClose={onClose} />
      )}
    </>
  )
}

EditorModals.propTypes = {
  mdeRef: PropTypes.oneOfType([
    // https://stackoverflow.com/questions/48007326/what-is-the-correct-proptype-for-a-ref-in-react
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),
  onSave: PropTypes.func.isRequired,
  modalType: PropTypes.oneOf(["hyperlink", "media", "instagram"]).isRequired,
  onClose: PropTypes.func.isRequired,
}

export default EditorModals
