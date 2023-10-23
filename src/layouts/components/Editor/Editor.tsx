import "./styles.scss"

import { Box, Divider } from "@chakra-ui/react"
import { EditorContent } from "@tiptap/react"

import { useEditorContext } from "contexts/EditorContext"

import { LinkBubbleMenu } from "./LinkBubbleMenu"
import MenuBar from "./MenuBar"
import { TableBubbleMenu } from "./TableBubbleMenu"

export const Editor = () => {
  const { editor } = useEditorContext()

  return (
    <Box className="editor" h="100%" ml="1rem" minH="70vh" maxW="40%">
      <MenuBar editor={editor} />
      <LinkBubbleMenu />
      <TableBubbleMenu />
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
