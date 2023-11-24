import {
  CommandManager,
  createChainableState,
  isAtEndOfNode,
  isNodeActive,
  mergeAttributes,
  Node,
} from "@tiptap/core"
import { Schema, Node as ProseMirrorNode } from "@tiptap/pm/model"
import { Plugin, PluginKey, Selection } from "@tiptap/pm/state"
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
      deleteCards: () => ReturnType
    }
  }
}

const createCard = (
  schema: Schema,
  title?: string,
  description?: string,
  footer?: string,
  link?: string,
  image?: string
): ProseMirrorNode => {
  const { nodes } = schema

  const cardBodyNode = nodes.isomercardbody.create({}, [
    nodes.isomercardtitle.create(
      {},
      schema.text(title ?? "This is a title for your card")
    ),
    nodes.isomercarddescription.create(
      {},
      schema.text(
        description ?? "This is body text for your card. Describe your card."
      )
    ),
    nodes.isomercardlink.create(
      {},
      schema.text(footer ?? "This is a link for your card")
    ),
  ])

  const cardImageNode = nodes.isomercardimage.create(
    {},
    nodes.image.create({ src: image ?? "https://placehold.co/600x400" })
  )

  if (link) {
    return nodes.isomerclickablecard.create({ href: link }, [
      cardImageNode,
      cardBodyNode,
    ])
  }

  return nodes.isomercard.create({}, [cardImageNode, cardBodyNode])
}

const createCardGrid = (
  schema: Schema,
  numberOfCards: number
): ProseMirrorNode => {
  const { nodes } = schema

  const cards = Array(numberOfCards).fill(createCard(schema))

  return nodes.isomercards.create({}, cards)
}

export const IsomerCards = Node.create<CardOptions>({
  name: "isomercards",
  group: "block",
  atom: true,
  draggable: true,
  defining: true,
  selectable: true,
  priority: 1100,

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
      addCards: () => ({ tr, dispatch, editor }) => {
        const node = createCardGrid(editor.schema, 3)

        if (dispatch) {
          const offset = tr.selection.anchor + 1

          tr.replaceSelectionWith(node)
            .scrollIntoView()
            .setSelection(Selection.near(tr.doc.resolve(offset)))
        }

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
  group: "isomercardblock",
  draggable: false,
  selectable: false,
  defining: false,
  priority: 1100,

  content:
    "(isomercardimage isomercardbody?) | (isomercardimage? isomercardbody)",

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
        tag: "div.isomer-card-grid > div.isomer-card",
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", HTMLAttributes, 0]
  },
})

export const IsomerClickableCard = Node.create<CardOptions>({
  name: "isomerclickablecard",
  group: "isomercardblock",
  draggable: false,
  selectable: false,
  priority: 1100,

  content:
    "(isomercardimage isomercardbody?) | (isomercardimage? isomercardbody)",

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
        tag: "div.isomer-card-grid > a.isomer-card",
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ["a", HTMLAttributes, 0]
  },
})

export const IsomerCardImage = Node.create<CardOptions>({
  name: "isomercardimage",
  group: "isomercardblock",
  draggable: false,
  selectable: false,
  priority: 1100,

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
        tag: "div.isomer-card-grid > div.isomer-card > div.isomer-card-image",
      },
      {
        tag: "div.isomer-card-grid > a.isomer-card > div.isomer-card-image",
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", HTMLAttributes, 0]
  },
})

export const IsomerCardBody = Node.create<CardOptions>({
  name: "isomercardbody",
  group: "isomercardblock",
  draggable: false,
  selectable: false,
  priority: 1100,

  content: `(isomercardtitle isomercarddescription? isomercardlink?) |
  (isomercardtitle? isomercarddescription isomercardlink?) |
  (isomercardtitle? isomercarddescription? isomercardlink)`,
  // content: "isomercardtitle isomercarddescription isomercardlink",

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
        tag: "div.isomer-card-grid > div.isomer-card > div.isomer-card-body",
      },
      {
        tag: "div.isomer-card-grid > a.isomer-card > div.isomer-card-body",
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", HTMLAttributes, 0]
  },
})

export const IsomerCardTitle = Node.create<CardOptions>({
  name: "isomercardtitle",
  group: "isomercardblock",
  draggable: false,
  selectable: false,
  priority: 1100,
  marks: "",

  content: "text?",

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
        tag:
          "div.isomer-card-grid > div.isomer-card > div.isomer-card-body > div.isomer-card-title",
      },
      {
        tag:
          "div.isomer-card-grid > a.isomer-card > div.isomer-card-body > div.isomer-card-title",
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", HTMLAttributes, 0]
  },
})

export const IsomerCardDescription = Node.create<CardOptions>({
  name: "isomercarddescription",
  group: "isomercardblock",
  draggable: false,
  selectable: false,
  priority: 1100,
  marks: "",

  content: "text?",

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
        tag:
          "div.isomer-card-grid > div.isomer-card > div.isomer-card-body > div.isomer-card-description",
      },
      {
        tag:
          "div.isomer-card-grid > a.isomer-card > div.isomer-card-body > div.isomer-card-description",
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", HTMLAttributes, 0]
  },
})

export const IsomerCardLink = Node.create<CardOptions>({
  name: "isomercardlink",
  group: "isomercardblock",
  draggable: false,
  selectable: false,
  priority: 1100,
  marks: "",

  content: "text?",

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
        tag:
          "div.isomer-card-grid > div.isomer-card > div.isomer-card-body > div.isomer-card-link",
      },
      {
        tag:
          "div.isomer-card-grid > a.isomer-card > div.isomer-card-body > div.isomer-card-link",
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ["div", HTMLAttributes, 0]
  },
})
