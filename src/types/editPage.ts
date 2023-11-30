export interface EditorEmbedContents {
  value: string
}

export type DrawerVariant = "cards"

export interface EditorCard {
  image: string
  altText: string
  title: string
  description?: string
  linkUrl: string
  linkText: string
}

export interface EditorCardsInfo {
  isDisplayImage: boolean
  cards: EditorCard[]
}
