import { Box } from "@chakra-ui/react"
import { BubbleMenu, Editor } from "@tiptap/react"

import { useEditorContext } from "contexts/EditorContext"

import { MenuItem } from "./MenuItem"

interface TableBubbleMenuProps {
  editor?: Editor
}

export const TableBubbleMenu = ({
  editor: passedEditor,
}: TableBubbleMenuProps) => {
  const { editor: contextEditor } = useEditorContext()
  const editor = passedEditor || contextEditor

  return (
    <BubbleMenu
      shouldShow={() => editor.isActive("table") && !editor.isActive("link")}
      editor={editor}
      tippyOptions={{ duration: 100 }}
    >
      <Box
        background="grey.50"
        borderRadius="2rem"
        p="2px 6px"
        opacity="50%"
        _hover={{
          opacity: "100%",
        }}
      >
        <MenuItem
          icon="insert-column-left"
          action={() => editor.chain().focus().addColumnBefore().run()}
          title="Add column before"
          isRound
        />
        <MenuItem
          icon="insert-column-right"
          action={() => editor.chain().focus().addColumnAfter().run()}
          title="Add column after"
          isRound
        />
        <MenuItem
          icon="delete-column"
          action={() => editor.chain().focus().deleteColumn().run()}
          title="Delete column"
          isRound
        />
        <MenuItem
          icon="insert-row-top"
          action={() => editor.chain().focus().addRowBefore().run()}
          title="Add row before"
          isRound
        />
        <MenuItem
          icon="insert-row-bottom"
          action={() => editor.chain().focus().addRowAfter().run()}
          title="Add row after"
          isRound
        />
        <MenuItem
          icon="delete-row"
          action={() => editor.chain().focus().deleteRow().run()}
          title="Delete row"
          isRound
        />
      </Box>
    </BubbleMenu>
  )
}
