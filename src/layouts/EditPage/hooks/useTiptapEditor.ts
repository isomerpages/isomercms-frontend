import BubbleMenu from "@tiptap/extension-bubble-menu"
import CharacterCount from "@tiptap/extension-character-count"
import Highlight from "@tiptap/extension-highlight"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import TableRow from "@tiptap/extension-table-row"
import TaskItem from "@tiptap/extension-task-item"
import TaskList from "@tiptap/extension-task-list"
import Underline from "@tiptap/extension-underline"
import { useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { DetailsContent } from "@tiptap-pro/extension-details-content"
import { DetailsSummary } from "@tiptap-pro/extension-details-summary"
import { Markdown } from "tiptap-markdown"

import {
  FormSG,
  FormSGDiv,
  FormSGIframe,
  Iframe,
  Instagram,
  IsomerCard,
  IsomerCardBody,
  IsomerCardDescription,
  IsomerCardImage,
  IsomerCardLink,
  IsomerCards,
  IsomerCardTitle,
  IsomerClickableCard,
  IsomerImage,
  TrailingNode,
} from "layouts/components/Editor/extensions"
import { IsomerDetailsGroup } from "layouts/components/Editor/extensions/Details/IsomerDetailGroup"
import { IsomerDetails } from "layouts/components/Editor/extensions/Details/IsomerDetails"
import { Table } from "layouts/components/Editor/extensions/Table"

export const useTiptapEditor = () => {
  return useEditor({
    extensions: [
      StarterKit,
      Highlight,
      TaskList,
      TaskItem,
      CharacterCount,
      IsomerImage,
      Link.extend({
        priority: 100,
        parseHTML() {
          return [{ tag: "a:not(.isomer-card)" }]
        },
      }).configure({
        openOnClick: false,
        protocols: ["mailto"],
      }),
      Iframe,
      FormSG,
      FormSGDiv,
      FormSGIframe,
      Instagram,
      IsomerCards,
      IsomerCard,
      IsomerClickableCard,
      IsomerCardImage,
      IsomerCardBody,
      IsomerCardTitle,
      IsomerCardDescription,
      IsomerCardLink,
      Markdown,
      BubbleMenu.configure({
        pluginKey: "linkBubble",
      }),
      BubbleMenu.configure({
        pluginKey: "tableBubble",
      }),
      BubbleMenu.configure({
        pluginKey: "imageBubble",
      }),
      BubbleMenu.configure({
        pluginKey: "cardsBubble",
      }),
      Table.configure({
        resizable: false,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Underline,
      Placeholder.configure({
        includeChildren: true,
        placeholder: ({ node }) => {
          if (node.type.name === "detailsSummary") {
            return "Summary"
          }

          return ""
        },
      }),
      IsomerDetails.configure({
        HTMLAttributes: {
          class: "isomer-details",
        },
      }),
      DetailsSummary,
      DetailsContent.configure({
        HTMLAttributes: {
          class: "isomer-details-content",
        },
      }),
      IsomerDetailsGroup,
      TrailingNode,
    ],
    autofocus: "start",
  })
}
