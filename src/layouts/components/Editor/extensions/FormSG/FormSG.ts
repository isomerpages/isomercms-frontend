import { Node } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"
import _ from "lodash"

import { TIPTAP_FORMSG_NODE_PRIORITY } from "constants/tiptap"

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

export const FormSGDiv = Node.create({
  name: "formsgdiv",
  group: "formsg",
  content: "inline*",
  draggable: false,
  defining: true,

  addAttributes() {
    return {
      style: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[style]:has(> a[href^="https://form.gov.sg"])',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      {
        style: HTMLAttributes.style,
      },
      0,
    ]
  },
})

export const FormSGIframe = Node.create({
  name: "formsgiframe",
  group: "formsg",
  atom: true,
  draggable: true,
  defining: true,

  addAttributes() {
    return {
      id: {
        default: "iframe",
      },
      src: {
        default: null,
      },
      style: {
        default: "width: 100%; height: 500px",
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
    return ["iframe", HTMLAttributes]
  },
})

export const FormSG = Node.create<FormSGOptions>({
  name: "formsg",
  priority: TIPTAP_FORMSG_NODE_PRIORITY,
  group: "block",
  content: "formsgdiv formsgiframe formsgdiv",
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

  parseHTML() {
    return [
      {
        tag: 'div[class="formsg-wrapper"]',
      },
    ]
  },

  renderHTML() {
    return ["div", { class: "formsg-wrapper" }, 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(FormSGView)
  },
})
