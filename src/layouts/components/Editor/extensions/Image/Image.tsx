import Image from "@tiptap/extension-image"
import { ReactNodeViewRenderer } from "@tiptap/react"

import { ImageView } from "./ImageView"

export const IsomerImage = Image.extend({
  addNodeView() {
    return ReactNodeViewRenderer(ImageView)
  },
})
