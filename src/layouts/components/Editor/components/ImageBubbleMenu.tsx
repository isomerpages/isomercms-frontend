import { BubbleMenu } from "@tiptap/react"

import { useEditorContext } from "contexts/EditorContext"
import { useEditorModal } from "contexts/EditorModalContext"

const ImageLinkButton = () => {
  const { showModal } = useEditorModal()

  return (
    <>
      <button
        // TODO: Replace with a nice looking button
        style={{
          border: "1px solid black",
          borderRadius: "5px",
          padding: "1px 6px",
          backgroundColor: "white",
        }}
        type="button"
        onClick={() => {
          showModal("images")
        }}
      >
        Change image
      </button>
    </>
  )
}

export const ImageBubbleMenu = () => {
  const { editor } = useEditorContext()

  return (
    <BubbleMenu
      shouldShow={() => editor.isActive("image")}
      editor={editor}
      tippyOptions={{ duration: 100 }}
    >
      <ImageLinkButton />
    </BubbleMenu>
  )
}
