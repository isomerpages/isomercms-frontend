import { PropsWithChildren, createContext, useContext, useState } from "react"

type BlocksTab = "content" | "add" | "edit"

interface UseBlocksReturn {
  curTab: BlocksTab
  showAddView: () => void
  showContentView: () => void
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

export const BlocksContextProvider = ({
  children,
}: PropsWithChildren<unknown>): JSX.Element => {
  const [curTab, setCurTab] = useState<BlocksTab>("content")

  return (
    <BlocksContext.Provider
      value={{
        showAddView: () => setCurTab("add"),
        showContentView: () => setCurTab("content"),
        curTab,
      }}
    >
      {children}
    </BlocksContext.Provider>
  )
}
