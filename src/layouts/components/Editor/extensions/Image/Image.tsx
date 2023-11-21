import Image from "@tiptap/extension-image"
import { ReactNodeViewRenderer } from "@tiptap/react"

import { ImageView } from "./ImageView"

export const IsomerImage = Image.extend({
  parseHTML() {
    return [
      {
        tag: "img",
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", this.options.HTMLAttributes, ["img", HTMLAttributes]]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageView)
  },
})
