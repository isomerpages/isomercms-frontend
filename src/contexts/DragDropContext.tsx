import { OnDragEndResponder } from "@hello-pangea/dnd"
import { createContext, PropsWithChildren, useContext } from "react"

interface DragDropContextReturn {
  onDragEnd: OnDragEndResponder
}

export const DragDropContext = createContext<null | DragDropContextReturn>(null)

export const useDragDropContext = (): DragDropContextReturn => {
  const context = useContext(DragDropContext)
  if (context === null) {
    throw new Error(
      "useDragDropContext must be used within a DragDropContextProvider"
    )
  }
  return context
}

export const DragDropContextProvider = ({
  onDragEnd,
  children,
}: PropsWithChildren<DragDropContextReturn>) => {
  return (
    <DragDropContext.Provider
      value={{
        onDragEnd,
      }}
    >
      {children}
    </DragDropContext.Provider>
  )
}
