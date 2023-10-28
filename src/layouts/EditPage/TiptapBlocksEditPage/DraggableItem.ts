import { mergeAttributes, Node } from "@tiptap/core"
import { ReactNodeViewRenderer } from "@tiptap/react"

import { DraggableView } from "./DraggableView"

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    dnd: {
      /**
       * Add a dnd block
       */
      setDraggable: () => ReturnType
      unsetDraggable: () => ReturnType
      toggleDraggable: () => ReturnType
    }
  }
}

export default Node.create({
  name: "draggableItem",

  group: "block",

  content: "block+",

  draggable: true,

  addKeyboardShortcuts() {
    return {
      "Mod-E": () => this.editor.commands.toggleDraggable(),
    }
  },

  parseHTML() {
    return [
      {
        tag: 'div[data-type="draggable-item"]',
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { "data-type": "draggable-item" }),
      0,
    ]
  },

  addNodeView() {
    return ReactNodeViewRenderer(DraggableView)
  },

  addCommands() {
    return {
      toggleDraggable: () => ({ chain }) => {
        if (this.editor.isActive("draggableItem")) {
          return chain().deleteNode("draggableItem").run()
        }
        return chain().setNode("draggableItem").run()
      },
      setDraggable: () => ({ chain }) => {
        return chain().setNode("draggableItem").run()
      },
      unsetDraggable: () => ({ chain }) => {
        return chain().deleteNode("draggableItem").run()
      },
    }
  },
})
