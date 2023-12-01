import TiptapTable from "@tiptap/extension-table"
import {
  ReactNodeViewRenderer,
  ReactNodeViewRendererOptions,
} from "@tiptap/react"
import { ReactNode, createElement } from "react"
import { createRoot } from "react-dom/client"

import { useEditorContext } from "contexts/EditorContext"

import { BlockWrapper } from "../../components/BlockWrapper"

import { TableView } from "./TableView"

import "./styles.scss"

export const Table = TiptapTable.extend({
  draggable: true,
  addNodeView() {
    return ({ node, getPos, editor }) => {
      const dom = document.createElement("div")
      const contentDOM = document.createElement("table")

      // NOTE: Append to `dom` as this should not be editable.
      const blockWrapper = document.createElement("div")
      blockWrapper.setAttribute("data-group", "true")
      blockWrapper.className = "table-block-wrapper"

      const textBox = document.createElement("div")
      textBox.className = "table-block-label"
      const { from, to } = editor.state.selection
      const isSelected =
        typeof getPos === "function" &&
        from <= getPos() &&
        to >= getPos() + node.nodeSize
      // const isSelected = editor.isActive("table")
      console.log("isSelected", isSelected)
      // textBox.style.display = isSelected ? "block" : "none"

      const text = document.createElement("p")
      text.textContent = "Table"

      console.log("editor", editor)

      const borderWrapper = document.createElement("div")
      borderWrapper.className = "table-block-border"
      // borderWrapper.style.border = isSelected
      //   ? "2px solid #055AFF"
      //   : "2px solid transparent"

      // TODO: append contentDom to our wrapper
      dom.appendChild(blockWrapper)
      textBox.appendChild(text)
      blockWrapper.appendChild(textBox)
      blockWrapper.appendChild(borderWrapper)
      borderWrapper.append(contentDOM)
      contentDOM.appendChild(document.createElement("tbody"))
      // const root = createRoot(dom)
      // root.render(<BlockWrapper></BlockWrapper>)
      // const contentDOM = createElement(
      //   BlockWrapper,
      //   { name: "Table", isSelected: editor.isActive("table") },
      //   [table] as ReactNode
      // )
      return { dom, contentDOM }
    }
  },
}).configure({
  allowTableNodeSelection: true,
})
