import BubbleMenu from "@tiptap/extension-bubble-menu"
import CharacterCount from "@tiptap/extension-character-count"
import Highlight from "@tiptap/extension-highlight"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import Table from "@tiptap/extension-table"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import TableRow from "@tiptap/extension-table-row"
import TaskItem from "@tiptap/extension-task-item"
import TaskList from "@tiptap/extension-task-list"
import { useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Markdown } from "tiptap-markdown"

import { Iframe } from "layouts/components/Editor/extensions"

import DraggableItem from "./DraggableItem"

export const usePreviewEditor = () => {
  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      TaskList,
      TaskItem,
      CharacterCount,
      Image.configure({ allowBase64: true }),
      Link.configure({ openOnClick: false }),
      Iframe,
      Markdown,
      BubbleMenu.configure({
        pluginKey: "linkBubble",
      }),
      BubbleMenu.configure({
        pluginKey: "tableBubble",
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder,
      DraggableItem,
    ],
    autofocus: "start",
    content: `<p>This is a boring paragraph.</p>
    <div data-type="draggable-item">
      <p>Followed by a fancy draggable item.</p>
    </div>
    <div data-type="draggable-item">
      <p>And another draggable item.</p>
      <div data-type="draggable-item">
        <p>And a nested one.</p>
        <div data-type="draggable-item">
          <p>But can we go deeper?</p>
        </div>
      </div>
    </div>
    <p>Let’s finish with a boring paragraph.</p>`,
  })

  return editor
}
