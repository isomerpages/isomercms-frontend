import "./styles.scss"

import { Box, BoxProps, Divider, Flex, Text } from "@chakra-ui/react"
import { EditorContent } from "@tiptap/react"

import { useEditorContext } from "contexts/EditorContext"

import { LinkBubbleMenu, MenuBar, TableBubbleMenu } from "./components"

export const Editor = (props: BoxProps) => {
  const { editor } = useEditorContext()

  return (
    <Box p="1.25rem" h="100%" maxW="50%" {...props}>
      <Flex
        bg="white"
        border="1px solid"
        borderColor="base.divider.strong"
        flexDir="column"
        borderRadius="0.25rem"
        h="100%"
      >
        <MenuBar editor={editor} />
        <LinkBubbleMenu />
        <TableBubbleMenu />
        <Box
          as={EditorContent}
          editor={editor}
          flex="1 1 auto"
          overflowX="hidden"
          overflowY="auto"
          p="1.25rem 1rem"
          h="100%"
        />
        <Divider borderColor="base.divider.strong" />
        <Flex
          alignItems="center"
          flex="0 0 auto"
          flexWrap="wrap"
          p="0.25rem 0.75rem"
        >
          <Text>
            {editor.storage.characterCount.characters()} characters
            <br />
            {editor.storage.characterCount.words()} words
          </Text>
        </Flex>
      </Flex>
    </Box>
  )
}
