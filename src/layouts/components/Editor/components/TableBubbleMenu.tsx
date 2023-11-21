import { Box } from "@chakra-ui/react"
import { BubbleMenu } from "@tiptap/react"

import { useEditorContext } from "contexts/EditorContext"

import {
  BxAddColLeft,
  BxAddColRight,
  BxAddRowAbove,
  BxAddRowBelow,
  BxDelCol,
  BxDelRow,
} from "assets"

import { MenuItem } from "./MenuItem"

export const TableBubbleMenu = () => {
  const { editor } = useEditorContext()

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
          icon={BxAddColLeft}
          action={() => editor.chain().focus().addColumnBefore().run()}
          title="Add column before"
          isRound
        />
        <MenuItem
          icon={BxAddColRight}
          action={() => editor.chain().focus().addColumnAfter().run()}
          title="Add column after"
          isRound
        />
        <MenuItem
          icon={BxDelCol}
          action={() => editor.chain().focus().deleteColumn().run()}
          title="Delete column"
          isRound
        />
        <MenuItem
          icon={BxAddRowAbove}
          action={() => editor.chain().focus().addRowBefore().run()}
          title="Add row before"
          isRound
        />
        <MenuItem
          icon={BxAddRowBelow}
          action={() => editor.chain().focus().addRowAfter().run()}
          title="Add row after"
          isRound
        />
        <MenuItem
          icon={BxDelRow}
          action={() => editor.chain().focus().deleteRow().run()}
          title="Delete row"
          isRound
        />
      </Box>
    </BubbleMenu>
  )
}
