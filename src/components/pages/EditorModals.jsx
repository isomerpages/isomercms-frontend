import { yupResolver } from "@hookform/resolvers/yup"
import HyperlinkModal from "components/HyperlinkModal"
import MediaModal from "components/media/MediaModal"
import PropTypes from "prop-types"
import React from "react"
import { useForm, FormProvider } from "react-hook-form"
import * as Yup from "yup"

const EditorModals = ({ mdeRef, onSave, modalType, onClose, mediaType }) => {
  const methods = useForm({
    mode: "onBlur",
    resolver: yupResolver(
      Yup.object({
        altText: Yup.string()
          .required("Alt text is required")
          .max(100, "Alt text should be less than 100 characters"),
      })
    ),
  })

  const onHyperlinkSave = (text, link) => {
    const cm = mdeRef.current.simpleMde.codemirror
    cm.replaceSelection(`[${text}](${link})`)
    // set state so that rerender is triggered and path is shown
    onSave(mdeRef.current.simpleMde.codemirror.getValue())
    onClose()
  }

  const onMediaSelect = (data) => {
    const { selectedMediaPath, altText } = data
    const cm = mdeRef.current.simpleMde.codemirror
    cm.replaceSelection(
      `![${altText}](${selectedMediaPath.replaceAll(" ", "%20")})`
    )
    // set state so that rerender is triggered and image is shown
    onSave(mdeRef.current.simpleMde.codemirror.getValue())
    onClose()
  }

  return (
    <FormProvider {...methods}>
      {modalType == "media" && mediaType && (
        <MediaModal
          onClose={onClose}
          type={mediaType}
          onProceed={onMediaSelect}
        />
      )}
      {modalType == "hyperlink" && (
        <HyperlinkModal
          text={mdeRef.current.simpleMde.codemirror.getSelection()}
          onSave={onHyperlinkSave}
          onClose={onClose}
        />
      )}
    </FormProvider>
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
