import { Editor } from "@tiptap/react"
import { PropsWithChildren, createContext, useContext } from "react"

interface EditorContextProps {
  editor: Editor
}

const EditorContext = createContext<null | EditorContextProps>(null)

export const useEditorContext = (): EditorContextProps => {
  const editorContext = useContext(EditorContext)
  if (!editorContext)
    throw new Error("useLoginContext must be used within an LoginProvider")

  return editorContext
}

export const EditorContextProvider = ({
  editor,
  ...rest
}: PropsWithChildren<EditorContextProps>): JSX.Element => {
  return <EditorContext.Provider value={{ editor }} {...rest} />
}
