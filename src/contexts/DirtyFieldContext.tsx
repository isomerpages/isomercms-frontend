import { createContext, PropsWithChildren, useContext, useState } from "react"

interface DirtyFieldContextReturn {
  isDirty: boolean
  setIsDirty: (isDirty: boolean) => void
}

export const DirtyFieldContext = createContext<null | DirtyFieldContextReturn>(
  null
)

export const useDirtyFieldContext = (): DirtyFieldContextReturn => {
  const context = useContext(DirtyFieldContext)
  if (context === null) {
    throw new Error(
      "useDirtyFieldContext must be used within a DirtyFieldContextProvider"
    )
  }
  return context
}

export const DirtyFieldContextProvider = ({
  children,
}: PropsWithChildren<Record<string, unknown>>) => {
  const [isDirty, setIsDirty] = useState(false)
  return (
    <DirtyFieldContext.Provider
      value={{
        isDirty,
        setIsDirty,
      }}
    >
      {children}
    </DirtyFieldContext.Provider>
  )
}
