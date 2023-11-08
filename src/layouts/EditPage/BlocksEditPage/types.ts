import { Extensions } from "@tiptap/core"
import { IconType } from "react-icons"

export interface Block {
  content: string
  extensions: Extensions
  variant: BlockVariant
}

export interface BlockAddView {
  title: string
  description: string
  icon: IconType
  variant: BlockVariant
}

export type BlockVariant = "text" | "image" | "embed" | "table"
