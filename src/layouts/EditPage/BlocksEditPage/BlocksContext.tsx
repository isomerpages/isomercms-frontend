import { OnDragEndResponder } from "@hello-pangea/dnd"
import { Editor, useEditor } from "@tiptap/react"
import { PropsWithChildren, createContext, useContext, useState } from "react"

import { updatePositions } from "hooks/useDrag"

import { DEFAULT_BLOCKS } from "./constants"
import { Block, BlockVariant } from "./types"

type BlocksTab = "content" | "add" | "edit"

interface UseBlocksReturn {
  blocks: Block[]
  curBlockIdx: number
  curTab: BlocksTab
  showAddView: () => void
  showContentView: () => void
  showEditorView: (idx: number) => void
  addBlock: (variant: BlockVariant) => void
  onDragEnd: OnDragEndResponder
  sync: (content: string, idx: number) => void
  focus: (idx: number) => void
  editors: Record<BlockVariant, Editor | null>
}

const BlocksContext = createContext<null | UseBlocksReturn>(null)

export const useBlocks = (): UseBlocksReturn => {
  const blocksContext = useContext(BlocksContext)
  if (!blocksContext)
    throw new Error(
      "useBlocksContext must be used within an BlocksContextProvider"
    )

  return blocksContext
}

interface BlocksContextProviderProps {
  blocks: Block[]
}

export const BlocksContextProvider = ({
  blocks: initialBlocks,
  ...rest
}: PropsWithChildren<BlocksContextProviderProps>): JSX.Element => {
  const [curTab, setCurTab] = useState<BlocksTab>("content")
  const [curBlockIdx, setCurBlockIdx] = useState(0)
  const [blocks, setBlocks] = useState<Block[]>(initialBlocks)

  const table = useEditor({
    extensions: DEFAULT_BLOCKS.table.extensions,
    onUpdate: ({ editor }) => {
      blocks[curBlockIdx].content = editor.getHTML()
    },
  })

  const text = useEditor({
    extensions: DEFAULT_BLOCKS.text.extensions,
    onUpdate: ({ editor }) => {
      blocks[curBlockIdx].content = editor.getHTML()
    },
  })

  const image = useEditor({
    extensions: DEFAULT_BLOCKS.image.extensions,
    onUpdate: ({ editor }) => {
      blocks[curBlockIdx].content = editor.getHTML()
    },
  })

  const embed = useEditor({
    extensions: DEFAULT_BLOCKS.embed.extensions,
    onUpdate: ({ editor }) => {
      blocks[curBlockIdx].content = editor.getHTML()
    },
  })

  const editors = {
    text,
    image,
    table,
    embed,
  }

  return (
    <BlocksContext.Provider
      value={{
        blocks,
        curBlockIdx,
        curTab,
        showAddView: () => setCurTab("add"),
        showContentView: () => setCurTab("content"),
        showEditorView: (curIdx: number) => {
          setCurBlockIdx(curIdx)
          setCurTab("edit")
        },
        addBlock: (blockVariant) => {
          setBlocks([...blocks, DEFAULT_BLOCKS[blockVariant]])
        },
        onDragEnd: ({ source, destination }) => {
          if (!destination) return

          const newBlocks = updatePositions(
            blocks,
            source.index,
            destination.index,
            blocks[source.index]
          )

          setBlocks(newBlocks)
        },
        sync: (content: string, idx: number) => {
          const newBlocks = [...blocks]
          newBlocks[idx].content = content
          setBlocks(newBlocks)
        },
        focus: (idx) => {
          setCurBlockIdx(idx)
        },
        editors,
      }}
      {...rest}
    />
  )
}
