export interface EditorEmbedContents {
  value: string
}

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
export type DrawerVariant = "cards" | "accordion"

export const AccordionBackgrounds = ["white", "grey"] as const

export type AccordionBackgroundType = typeof AccordionBackgrounds[number]
