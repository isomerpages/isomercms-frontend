import { Divider, HStack } from "@chakra-ui/react"
import { Editor } from "@tiptap/react"

import { useEditorModal } from "contexts/EditorModalContext"

import { MenuItem } from "./MenuItem"

export const MenuBar = ({ editor }: { editor: Editor }) => {
  const { showModal } = useEditorModal()

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
      type: "divider",
    },
    {
      icon: "bold",
      title: "Bold",
      action: () => editor.chain().focus().toggleBold().run(),
      isActive: () => editor.isActive("bold"),
    },
    {
      icon: "italic",
      title: "Italic",
      action: () => editor.chain().focus().toggleItalic().run(),
      isActive: () => editor.isActive("italic"),
    },
    {
      icon: "strikethrough",
      title: "Strike",
      action: () => editor.chain().focus().toggleStrike().run(),
      isActive: () => editor.isActive("strike"),
    },
    {
      icon: "double-quotes-l",
      title: "Blockquote",
      action: () => editor.chain().focus().toggleBlockquote().run(),
      isActive: () => editor.isActive("blockquote"),
    },

    {
      type: "divider",
    },

    {
      icon: "list-unordered",
      title: "Bullet List",
      action: () => editor.chain().focus().toggleBulletList().run(),
      isActive: () => editor.isActive("bulletList"),
    },
    {
      icon: "list-ordered",
      title: "Ordered List",
      action: () => editor.chain().focus().toggleOrderedList().run(),
      isActive: () => editor.isActive("orderedList"),
    },
    {
      icon: "list-check-2",
      title: "Task List",
      action: () => editor.chain().focus().toggleTaskList().run(),
      isActive: () => editor.isActive("taskList"),
    },
    {
      type: "divider",
    },
    {
      icon: "file-image-line",
      title: "Add image",
      action: () => showModal("images"),
    },
    {
      icon: "file-pdf-line",
      title: "Add file",
      action: () => showModal("files"),
    },
    {
      icon: "links-line",
      title: "Add link",
      action: () => showModal("hyperlink"),
    },
    {
      icon: "link-unlink",
      title: "Remove link",
      action: () => editor.chain().focus().unsetLink().run(),
    },
    {
      type: "divider",
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
    {
      icon: "separator",
      title: "Horizontal Rule",
      action: () => editor.chain().focus().setHorizontalRule().run(),
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
      {items.map((item) => (
        <>
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
        </>
      ))}
    </HStack>
  )
}
