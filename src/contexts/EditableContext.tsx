import { OnDragEndResponder } from "@hello-pangea/dnd"
import { createContext, PropsWithChildren, useContext } from "react"

interface EditEvent {
  target: {
    id: string
    value?: string
  }
}

interface EditableContextReturn {
  onDragEnd: OnDragEndResponder
  // TODO: Unify ALL the below functions
  // into a single interface
  onChange: (event: EditEvent) => void

  onCreate: (event: EditEvent) => void
  onDelete: (id: string, type: string) => void
  onDisplay: (elemType: string, index: number) => void
}

export const EditableContext = createContext<null | EditableContextReturn>(null)

export const useEditableContext = (): EditableContextReturn => {
  const context = useContext(EditableContext)
  if (context === null) {
    throw new Error(
      "useEditableContext must be used within a EditableContextProvider"
    )
  }
  return context
}

export const EditableContextProvider = ({
  children,
  ...rest
}: PropsWithChildren<EditableContextReturn>) => {
  return (
    <EditableContext.Provider value={rest}>{children}</EditableContext.Provider>
  )
}
