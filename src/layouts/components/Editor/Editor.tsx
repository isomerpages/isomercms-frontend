import "./styles.scss"

import { Box, Divider } from "@chakra-ui/react"
import { EditorContent } from "@tiptap/react"

import { useEditorContext } from "contexts/EditorContext"

import MenuBar from "./MenuBar"

export const Editor = () => {
  const { editor } = useEditorContext()

  if (!editor) return null

  return (
    <Box className="editor" h="100%" ml="1rem" minH="70vh" maxW="40%">
      {editor && <MenuBar editor={editor} />}
      <EditorContent className="editor__content" editor={editor} />
      <Divider />
      <Box className="editor__footer">
        {editor.storage.characterCount.characters()} characters
        <br />
        {editor.storage.characterCount.words()} words
      </Box>
    </Box>
  )
}
