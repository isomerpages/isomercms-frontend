import { PropsWithChildren, createContext, useContext } from "react"

import { DrawerVariant } from "types/editPage"

interface EditorDrawerContextProps {
  isAnyDrawerOpen: boolean
  isDrawerOpen: (drawerVariant: DrawerVariant) => boolean
  onDrawerOpen: (drawerVariant: DrawerVariant) => () => void
  onDrawerClose: (drawerVariant: DrawerVariant) => () => void
  onDrawerProceed: (drawerVariant: DrawerVariant) => () => void
}

const EditorDrawerContext = createContext<null | EditorDrawerContextProps>(null)

export const useEditorDrawerContext = (): EditorDrawerContextProps => {
  const editorDrawerContext = useContext(EditorDrawerContext)

  if (!editorDrawerContext) {
    throw new Error(
      "useEditorDrawer must be used within an EditorDrawerContextProvider"
    )
  }

  return editorDrawerContext
}

export const EditorDrawerContextProvider = ({
  isAnyDrawerOpen,
  isDrawerOpen,
  onDrawerOpen,
  onDrawerClose,
  onDrawerProceed,
  ...rest
}: PropsWithChildren<EditorDrawerContextProps>): JSX.Element => {
  return (
    <EditorDrawerContext.Provider
      value={{
        isAnyDrawerOpen,
        isDrawerOpen,
        onDrawerOpen,
        onDrawerClose,
        onDrawerProceed,
      }}
      {...rest}
    />
  )
}
