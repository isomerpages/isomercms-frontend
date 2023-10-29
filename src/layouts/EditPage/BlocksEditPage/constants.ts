import BubbleMenu from "@tiptap/extension-bubble-menu"
import CharacterCount from "@tiptap/extension-character-count"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import Table from "@tiptap/extension-table"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import TableRow from "@tiptap/extension-table-row"
import TaskItem from "@tiptap/extension-task-item"
import TaskList from "@tiptap/extension-task-list"
import StarterKit from "@tiptap/starter-kit"
import { BiCode, BiImage, BiTable, BiText } from "react-icons/bi"

import { Iframe } from "layouts/components/Editor/extensions"

import { Block, BlockAddView, BlockVariant } from "./types"

export const BLOCKS_CONTENT: Record<
  BlockVariant,
  BlockAddView & {
    getContent: (props: string) => string
  }
> = {
  text: {
    title: "Text",
    description:
      "Deliver useful information to your site visitors by using headings, body texts, links, and more.",
    icon: BiText,
    variant: "text",
    getContent: (content) => `<p>${content}</p>`,
  },
  image: {
    title: "Image",
    description:
      "Add an image to your page. You can add a caption and alt text to the image.",
    icon: BiImage,
    variant: "image",
    getContent: (src) => `<img src="${src}"/>`,
  },
  embed: {
    title: "Embed",
    description:
      "Add rich content such as YouTube, FormSG, CheckFirst and more.",
    icon: BiCode,
    variant: "embed",
    getContent: (embed) => embed,
  },
  table: {
    title: "Table",
    description: "Use a table to display key information in columns and rows.",
    icon: BiTable,
    variant: "table",
    getContent: (content) =>
      `<table><tbody><tr><th><p>${content}</p></th></tr></tbody></table>`,
  },
}

export const DEFAULT_BLOCKS: Record<BlockVariant, Omit<Block, "editor">> = {
  text: {
    content: "Write something...",
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
      }),
      BubbleMenu.configure({
        pluginKey: "linkBubble",
      }),
      TaskList,
      TaskItem,
      CharacterCount,
    ],
    variant: "text",
  },
  image: {
    content: "Write something...",
    extensions: [StarterKit, Image, CharacterCount],
    variant: "image",
  },
  embed: {
    content: "Write something...",
    extensions: [Iframe, StarterKit, CharacterCount],
    variant: "embed",
  },
  table: {
    content: "Write something...",
    extensions: [
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
      CharacterCount,
      StarterKit,
    ],
    variant: "table",
  },
}
