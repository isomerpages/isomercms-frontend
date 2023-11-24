import { Node } from "@tiptap/core"
import { Schema } from "@tiptap/pm/model"
import { ReactNodeViewRenderer } from "@tiptap/react"

import { CardsView } from "./CardsView"

export interface CardOptions {
  HTMLAttributes: {
    class: string
  }
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    cards: {
      /**
       * Add a new card grid block
       */
      addCards: () => ReturnType
    }
  }
}

export const IsomerCards = Node.create<CardOptions>({
  name: "isomercards",
  group: "block",
  atom: true,
  draggable: true,
  defining: true,
  priority: 300,

  content: "(isomercard | isomerclickablecard)+",

  addAttributes() {
    return {
      class: {
        default: "isomer-card-grid",
      },
    }
  },

  addCommands() {
    return {
      addCards: () => ({ commands }) => {
        commands.insertContent({
          type: this.name,
        })

        return true
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: "div.isomer-card-grid",
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", HTMLAttributes, 0]
  },

  addNodeView() {
    return ReactNodeViewRenderer(CardsView)
  },
})

export const IsomerCard = Node.create<CardOptions>({
  name: "isomercard",
  group: "block",
  atom: true,
  draggable: true,
  defining: true,
  priority: 300,

  content: "isomercardimage? isomercardbody?",

  addAttributes() {
    return {
      class: {
        default: "isomer-card",
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: "div.isomer-card",
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", HTMLAttributes, 0]
  },
})

export const IsomerClickableCard = Node.create<CardOptions>({
  name: "isomerclickablecard",
  group: "block",
  atom: true,
  draggable: true,
  defining: true,
  priority: 1100,
  inline: false,

  content: "isomercardimage? isomercardbody?",

  addAttributes() {
    return {
      class: {
        default: "isomer-card",
      },
      href: {
        default: null,
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: "a.isomer-card",
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ["a", HTMLAttributes, 0]
  },
})

export const IsomerCardImage = Node.create<CardOptions>({
  name: "isomercardimage",
  group: "block",
  atom: true,
  draggable: true,
  defining: true,
  priority: 300,

  content: "image",

  addAttributes() {
    return {
      class: {
        default: "isomer-card-image",
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: "div.isomer-card-image",
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", HTMLAttributes, 0]
  },
})

export const IsomerCardBody = Node.create<CardOptions>({
  name: "isomercardbody",
  group: "block",
  atom: true,
  draggable: true,
  defining: true,
  priority: 300,

  content: "isomercardtitle? isomercarddescription? isomercardlink?",

  addAttributes() {
    return {
      class: {
        default: "isomer-card-body",
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: "div.isomer-card-body",
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", HTMLAttributes, 0]
  },
})

export const IsomerCardTitle = Node.create<CardOptions>({
  name: "isomercardtitle",
  group: "block",
  atom: true,
  draggable: true,
  defining: true,
  priority: 300,

  content: "text*",

  addAttributes() {
    return {
      class: {
        default: "isomer-card-title",
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: "div.isomer-card-title",
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", HTMLAttributes, 0]
  },
})

export const IsomerCardDescription = Node.create<CardOptions>({
  name: "isomercarddescription",
  group: "block",
  atom: true,
  draggable: true,
  defining: true,
  priority: 300,

  content: "text*",

  addAttributes() {
    return {
      class: {
        default: "isomer-card-description",
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: "div.isomer-card-description",
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", HTMLAttributes, 0]
  },
})

export const IsomerCardLink = Node.create<CardOptions>({
  name: "isomercardlink",
  group: "block",
  atom: true,
  draggable: true,
  defining: true,
  priority: 300,

  content: "text*",

  addAttributes() {
    return {
      class: {
        default: "isomer-card-link",
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: "div.isomer-card-link",
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", HTMLAttributes, 0]
  },
})
