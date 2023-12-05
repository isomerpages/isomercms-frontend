import Image from "@tiptap/extension-image"
import { Selection } from "@tiptap/pm/state"
import { ReactNodeViewRenderer } from "@tiptap/react"

import { ImageView } from "./ImageView"

interface IsomerImageOptions {
  src: string
  alt?: string
  title?: string
  width?: string
  height?: string
  href?: string
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    isomerImage: {
      setImage: (options: IsomerImageOptions) => ReturnType
      deleteImage: () => ReturnType
    }
  }
}

export const IsomerImage = Image.extend({
  addAttributes() {
    return {
      src: {
        default: null,
      },
      alt: {
        default: null,
      },
      title: {
        default: null,
      },
      width: {
        default: "100%",
      },
      height: {
        default: "auto",
      },
      href: {
        default: null,
        parseHTML: (element) =>
          element.closest("a[href].isomer-image-wrapper")?.getAttribute("href"),
      },
    }
  },

  addCommands() {
    return {
      setImage: (options) => ({ tr, dispatch, editor }) => {
        if (!options.src) {
          return false
        }

        if (dispatch) {
          const offset = tr.selection.anchor + 1
          const node = editor.schema.nodes.image.create(options)

          tr.replaceSelectionWith(node)
            .scrollIntoView()
            .setSelection(Selection.near(tr.doc.resolve(offset)))
        }

        return true
      },

      deleteImage: () => ({ tr, editor }) => {
        editor.state.selection.replace(tr)
        return true
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: "img[src]",
      },
      {
        tag: "a[href].isomer-image-wrapper > img[src]",
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    const { href, ...rest } = HTMLAttributes

    if (href) {
      return [
        "a",
        {
          href,
          class: "isomer-image-wrapper",
        },
        ["img", rest],
      ]
    }

    return [
      "div",
      {
        class: "isomer-image-wrapper",
      },
      ["img", rest],
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(ImageView)
  },
})
