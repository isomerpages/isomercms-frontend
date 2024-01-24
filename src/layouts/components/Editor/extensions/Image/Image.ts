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

interface IsomerImageStyle {
  width?: number
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    isomerImage: {
      setImage: (options: IsomerImageOptions) => ReturnType
      setImageMeta: (
        options: Pick<IsomerImageOptions, "alt" | "href">
      ) => ReturnType
      deleteImage: () => ReturnType
      setImageStyle: (style: IsomerImageStyle) => ReturnType
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
      style: {
        default: "width: 100%",
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
          const node = editor.schema.nodes.image.create(options)

          if (tr.selection.empty) {
            const offset = tr.selection.to

            tr.insert(offset, node)
              .scrollIntoView()
              .setSelection(Selection.near(tr.doc.resolve(offset)))
          } else {
            const offset = tr.selection.to + 1

            tr.insert(offset, node)
              .scrollIntoView()
              .setSelection(Selection.near(tr.doc.resolve(offset)))
          }
        }

        return true
      },

      setImageMeta: (options) => ({ tr, dispatch, editor }) => {
        const { from, to } = tr.selection

        tr.doc.nodesBetween(from, to, (node, pos) => {
          if (node.type === editor.schema.nodes.image) {
            tr.setNodeMarkup(pos, null, { ...node.attrs, ...options })
          }
        })

        if (dispatch) {
          tr.scrollIntoView()
        }

        return true
      },

      deleteImage: () => ({ tr, editor }) => {
        editor.state.selection.replace(tr)
        return true
      },

      setImageStyle: (styleOptions) => ({ tr, dispatch, editor }) => {
        const { from, to } = tr.selection

        let style = ""

        if (styleOptions.width) {
          if (styleOptions.width < 1 || styleOptions.width > 100) {
            console.error(
              "Invalid width value. It should be between 1 and 100."
            )
            return false
          }
          style += `width: ${styleOptions.width}%;`
        }

        const attrs = { style }

        tr.doc.nodesBetween(from, to, (node, pos) => {
          if (node.type === editor.schema.nodes.image) {
            tr.setNodeMarkup(pos, null, { ...node.attrs, ...attrs })
          }
        })

        if (dispatch) {
          tr.scrollIntoView()
        }

        return true
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'img[src]:not([src^="data:"])',
      },
      {
        tag: 'a[href].isomer-image-wrapper > img[src]:not([src^="data:"])',
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
