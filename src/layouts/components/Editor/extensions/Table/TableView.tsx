import { NodeViewProps } from "@tiptap/core"
import { ReactNode, createElement } from "react"

import { BlockWrapper } from "../../components/BlockWrapper"

export const TableView = ({ selected }: NodeViewProps) => {
  const dom = document.createElement("div")
  const table = document.createElement("table")
  const contentDOM = createElement(
    BlockWrapper,
    { name: "Table", isSelected: selected },
    [table] as ReactNode
  )
  return { dom, contentDOM }
}
