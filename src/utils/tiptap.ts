import { Editor } from "@tiptap/core"

// Utility method to check if the currently active node is a supported embed
export const isEmbedActive = (editor: Editor) => {
  return (
    editor.isActive("iframe") ||
    editor.isActive("instagram") ||
    editor.isActive("formsg")
  )
}
