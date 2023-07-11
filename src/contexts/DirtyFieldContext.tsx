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
        // NOTE: Call the update only when the state changes
        // We do this optimisation because the context wraps
        // a form component.
        // The child components are re-rendered on every keystroke
        // which we want to minimise for performance reasons.
        setIsDirty: (newDirtyState) => {
          if (newDirtyState !== isDirty) {
            setIsDirty(newDirtyState)
          }
        },
      }}
    >
      {children}
    </DirtyFieldContext.Provider>
  )
}
