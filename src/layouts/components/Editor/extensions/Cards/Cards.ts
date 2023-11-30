import { Node } from "@tiptap/core"
import { Node as ProseMirrorNode, Schema } from "@tiptap/pm/model"
import { Selection } from "@tiptap/pm/state"
import { ReactNodeViewRenderer } from "@tiptap/react"

import { EditorCard } from "types/editPage"

import { CardsView } from "./CardsView"

export interface CardOptions {
  HTMLAttributes: {
    class: string
  }
}

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    cards: {
      // Add a new card grid block
      addCards: () => ReturnType
      // Delete the current card grid block
      deleteCards: () => ReturnType
      // Set the content of the current card grid block
      setCardsContent: (cardContent: EditorCard[]) => ReturnType
    }
  }
}

interface CreateCardProps {
  schema: Schema
  title?: string
  description?: string
  footer?: string
  link?: string
  image?: string
  altText?: string
}

const createCard = ({
  schema,
  title,
  description,
  footer,
  link,
  image,
  altText,
}: CreateCardProps): ProseMirrorNode => {
  const { nodes } = schema
  const templateCardBody = []
  const templateCard = []

  if (title && title !== "") {
    templateCardBody.push(nodes.isomercardtitle.create({}, schema.text(title)))
  }

  if (description && description !== "") {
    templateCardBody.push(
      nodes.isomercarddescription.create({}, schema.text(description))
    )
  }

  if (link && link !== "" && footer && footer !== "") {
    templateCardBody.push(nodes.isomercardlink.create({}, schema.text(footer)))
  }

  if (image && image !== "") {
    templateCard.push(
      nodes.isomercardimage.create(
        {},
        nodes.image.create({
          src: image,
          alt: altText ?? "Placeholder image",
        })
      )
    )
  }

  templateCard.push(nodes.isomercardbody.create({}, templateCardBody))

  if (link) {
    return nodes.isomerclickablecard.create({ href: link }, templateCard)
  }

  return nodes.isomercard.create({}, templateCard)
}

const createCardGrid = (
  schema: Schema,
  numberOfCards: number
): ProseMirrorNode => {
  const { nodes } = schema

  const cards = Array(numberOfCards).fill(
    createCard({
      schema,
      title: "This is a title for your card",
      description: "This is body text for your card. Describe your card.",
      footer: "This is a link for your card",
      link: "https://www.isomer.gov.sg",
      image: "https://placehold.co/600x400",
      altText: "Placeholder image",
    })
  )

  return nodes.isomercards.create({}, cards)
}

const createCardGridWithContent = (
  schema: Schema,
  content: EditorCard[]
): ProseMirrorNode => {
  const { nodes } = schema

  const cards = content.map((card) =>
    createCard({
      schema,
      title: card.title,
      description: card.description,
      footer: card.linkText,
      link: card.linkUrl,
      image: card.image,
      altText: card.altText,
    })
  )

  return nodes.isomercards.create({}, cards)
}

export const IsomerCards = Node.create<CardOptions>({
  name: "isomercards",
  group: "block",
  atom: true,
  draggable: true,
  defining: true,
  selectable: true,

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
      deleteCards: () => ({ tr, editor }) => {
        editor.state.selection.replace(tr)
        return true
      },
      setCardsContent: (content) => ({ tr, dispatch, editor }) => {
        if (dispatch) {
          const offset = tr.selection.anchor
          const node = createCardGridWithContent(editor.schema, content)

          tr.replaceSelectionWith(node)
            .scrollIntoView()
            .setSelection(
              Selection.near(
                tr.doc.resolve(tr.doc.resolve(offset).parentOffset)
              )
            )
        }

        return true
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: "div.isomer-card-grid:has(> div.isomer-card)",
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
      rel: {
        default: "noopener noreferrer nofollow",
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

  content: `(isomercardtitle isomercarddescription? isomercardlink?) |
  (isomercardtitle? isomercarddescription isomercardlink?) |
  (isomercardtitle? isomercarddescription? isomercardlink)`,

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
