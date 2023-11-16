import { Node, nodePasteRule } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"
import _ from "lodash"

import { FormSGView } from "./FormSGView"

export interface FormSGOptions {
  HTMLAttributes: {
    [key: string]: string
  }
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    formsg: {
      setFormsg: (options: { src: string }) => ReturnType
    }
  }
}

export const FormSG = Node.create<FormSGOptions>({
  name: "formsg",
  priority: 200,

  group: "block",
  atom: true,
  draggable: true,

  defining: true,

  addOptions() {
    return {
      HTMLAttributes: {
        class: "formsg-wrapper",
      },
    }
  },

  addAttributes() {
    return {
      src: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'iframe[src^="https://form.gov.sg/"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      this.options.HTMLAttributes,
      [
        "div",
        {
          style:
            "font-family: Sans-Serif; color: #000; opacity: 0.9; padding-top: 5px; padding-bottom: 8px;",
        },
        "If the form below is not loaded, you can also fill it in at ",
        ["a", { href: HTMLAttributes.src }, "here"],
      ],
      [
        "iframe",
        {
          id: "iframe",
          style: "width: 100%; height: 500px",
          src: HTMLAttributes.src,
        },
      ],
      [
        "div",
        {
          style:
            "font-family: Sans-Serif; font-size: 12px; color: #999; opacity: 0.5; padding-top: 5px;",
        },
        "Powered by ",
        [
          "a",
          {
            href: "https://form.gov.sg",
            style: "color: #999",
          },
          "Form",
        ],
      ],
    ]
  },

  addCommands() {
    return {
      setFormsg: (options: { src: string }) => ({ tr, dispatch }) => {
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
        find: /<div.*>.*href="https:\/\/form.gov.sg\/.*<iframe.*<\/div>/g,
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
    return ReactNodeViewRenderer(FormSGView)
  },
})
