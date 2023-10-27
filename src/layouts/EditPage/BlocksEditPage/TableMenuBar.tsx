import { Divider, HStack } from "@chakra-ui/react"
import { Editor } from "@tiptap/react"
import { Fragment } from "react"

import { MenuItem } from "../../components/Editor/components/MenuItem"

export const TableMenuBar = ({ editor }: { editor: Editor }) => {
  const items = [
    {
      icon: "h-1",
      title: "Heading 1",
      action: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
      isActive: () => editor.isActive("heading", { level: 1 }),
    },
    {
      icon: "h-2",
      title: "Heading 2",
      action: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
      isActive: () => editor.isActive("heading", { level: 2 }),
    },
    {
      icon: "h-3",
      title: "Heading 3",
      action: () => editor.chain().focus().toggleHeading({ level: 3 }).run(),
      isActive: () => editor.isActive("heading", { level: 3 }),
    },
    {
      icon: "paragraph",
      title: "Paragraph",
      action: () => editor.chain().focus().setParagraph().run(),
      isActive: () => editor.isActive("paragraph"),
    },
    {
      type: "divider",
    },
    {
      icon: "separator",
      title: "Horizontal Rule",
      action: () => editor.chain().focus().setHorizontalRule().run(),
    },
    {
      type: "divider",
    },
    {
      icon: "text-wrap",
      title: "Hard Break",
      action: () => editor.chain().focus().setHardBreak().run(),
    },
    {
      type: "divider",
    },
    {
      icon: "arrow-go-back-line",
      title: "Undo",
      action: () => editor.chain().focus().undo().run(),
    },
    {
      icon: "arrow-go-forward-line",
      title: "Redo",
      action: () => editor.chain().focus().redo().run(),
    },
    {
      icon: "table-line",
      title: "Add table",
      action: () =>
        editor
          .chain()
          .focus()
          // NOTE: Default to smallest multi table
          .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
          .run(),
    },
  ]

  return (
    <HStack
      bgColor="gray.50"
      flex="0 0 auto"
      flexWrap="wrap"
      p="0.25rem"
      borderBottom="1px solid"
      borderColor="base.divider.strong"
      borderTopRadius="0.25rem"
    >
      {items.map((item, index) => (
        // eslint-disable-next-line react/no-array-index-key
        <Fragment key={index}>
          {item.type === "divider" ? (
            <Divider
              orientation="vertical"
              border="px solid"
              borderColor="base.divider.strong"
              h="1.25rem"
            />
          ) : (
            <MenuItem {...item} />
          )}
        </Fragment>
      ))}
    </HStack>
  )
}
