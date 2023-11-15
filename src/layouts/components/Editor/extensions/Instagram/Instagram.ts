import { Node } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"

import { InstagramView } from "./InstagramView"

export interface InstagramOptions {
  HTMLAttributes: Record<string, string>
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    instagram: {
      /**
       * Add an Instagram embed
       */
      setInstagram: (options: { content: string }) => ReturnType
    }
  }
}

export const Instagram = Node.create<InstagramOptions>({
  name: "instagram",
  priority: 1000,

  group: "block",
  content: "block",
  atom: true,

  draggable: true,

  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: "instagram-wrapper",
      },
    }
  },

  addAttributes() {
    return {
      class: {
        default: null,
      },
      "data-instgrm-captioned": {
        default: null,
      },
      "data-instgrm-permalink": {
        default: null,
      },
      "data-instgrm-version": {
        default: null,
      },
      style: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'blockquote[class="instagram-media"]',
      },
    ]
  },

  renderHTML(props) {
    console.log(props)

    return [
      "div",
      this.options.HTMLAttributes,
      [["blockquote"]],
      ["script", { src: "//www.instagram.com/embed.js", async: true }],
    ]
  },

  addCommands() {
    return {
      setInstagram: (options: { content: string }) => ({ tr, dispatch }) => {
        const { selection } = tr
        const node = this.type.create({ content: options.content })

        if (dispatch) {
          tr.replaceRangeWith(selection.from, selection.to, node)
        }

        return true
      },
    }
  },

  addNodeView() {
    return ReactNodeViewRenderer(InstagramView)
  },
})
