import { Box } from "@chakra-ui/react"
import { BubbleMenu } from "@tiptap/react"
import remixiconUrl from "remixicon/fonts/remixicon.symbol.svg"

import { useEditorContext } from "contexts/EditorContext"

export const TableBubbleMenu = () => {
  const { editor } = useEditorContext()

  return (
    <BubbleMenu
      shouldShow={() => editor.isActive("table")}
      editor={editor}
      tippyOptions={{ duration: 100 }}
    >
      <Box background="black" borderRadius="2rem" p="2px 6px">
        <button
          type="button"
          onClick={() => editor.chain().focus().addColumnBefore().run()}
          title="Add column before"
          className="menu-item"
        >
          <svg className="remix">
            <use xlinkHref={`${remixiconUrl}#ri-insert-column-left`} />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().addColumnAfter().run()}
          title="Add column after"
          className="menu-item"
        >
          <svg className="remix">
            <use xlinkHref={`${remixiconUrl}#ri-insert-column-right`} />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().addRowBefore().run()}
          title="Add row before"
          className="menu-item"
          style={{
            fill: "red",
          }}
        >
          <svg className="remix">
            <use xlinkHref={`${remixiconUrl}#ri-insert-row-top`} />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().addRowAfter().run()}
          title="Add row after"
          className="menu-item"
        >
          <svg className="remix">
            <use xlinkHref={`${remixiconUrl}#ri-insert-row-bottom`} />
          </svg>
        </button>
      </Box>
    </BubbleMenu>
  )
}
