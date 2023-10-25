import { Node, nodePasteRule } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"
import _ from "lodash"

import { IframeView } from "./IframeView"

export interface IframeOptions {
  allowFullscreen: boolean
  HTMLAttributes: {
    [key: string]: string
  }
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    iframe: {
      /**
       * Add an iframe
       */
      setIframe: (options: { src: string }) => ReturnType
    }
  }
}

export default Node.create<IframeOptions>({
  name: "iframe",

  group: "block",
  atom: true,

  draggable: true,

  defining: true,

  addOptions() {
    return {
      allowFullscreen: true,
      HTMLAttributes: {
        class: "iframe-wrapper",
      },
    }
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
      frameborder: {
        default: 0,
      },
      allowfullscreen: {
        default: this.options.allowFullscreen,
        parseHTML: () => this.options.allowFullscreen,
      },
      width: {
        default: null,
      },
      height: {
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
        tag: "iframe",
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", this.options.HTMLAttributes, ["iframe", HTMLAttributes]]
  },

  addCommands() {
    return {
      setIframe: (options: { src: string }) => ({ tr, dispatch }) => {
        const { selection } = tr
        const node = this.type.create(options)

        if (dispatch) {
          tr.replaceRangeWith(selection.from, selection.to, node)
        }

        return true
      },
    }
  },

  addPasteRules() {
    return [
      nodePasteRule({
        find: /<iframe (.*)><\/iframe>/g,
        type: this.type,
        getAttributes: (match) => {
          const srcIndex = match.input?.search("src=")
          if (srcIndex && srcIndex > -1) {
            // NOTE: Extract the `src` property from the pasted `iframe` tag
            // and set the property on the node so that users have a view.
            const substring = match.input?.substring(srcIndex + 5)
            const src = _.takeWhile(substring, (char) => char !== '"').join("")
            return {
              src,
            }
          }
          return []
        },
      }),
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(IframeView)
  },
})
