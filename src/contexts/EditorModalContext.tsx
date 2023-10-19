import { PropsWithChildren, createContext, useContext } from "react"

interface EditorModalContextProps {
  showModal: (modalVariant: "images" | "files" | "hyperlink") => void
}

const EditorModalContext = createContext<null | EditorModalContextProps>(null)

export const useEditorModal = (): EditorModalContextProps => {
  const editorContext = useContext(EditorModalContext)
  if (!editorContext)
    throw new Error("useLoginContext must be used within an LoginProvider")

  return editorContext
}

export const EditorModalContextProvider = ({
  showModal,
  ...rest
}: PropsWithChildren<EditorModalContextProps>): JSX.Element => {
  return <EditorModalContext.Provider value={{ showModal }} {...rest} />
}
