import "../../components/Editor/styles.scss"

import { Box, BoxProps, Divider, Flex, Text } from "@chakra-ui/react"
import { EditorContent } from "@tiptap/react"

import {
  LinkBubbleMenu,
  TableBubbleMenu,
} from "../../components/Editor/components"

import { useBlocks } from "./BlocksContext"
import { EmbedMenuBar } from "./EmbedMenuBar"
import { ImageMenuBar } from "./ImageMenuBar"
import { TableMenuBar } from "./TableMenuBar"
import { TextMenuBar } from "./TextMenuBar"
import { BlockVariant } from "./types"

export const BlockEditor = ({
  variant,
  index,
  ...props
}: BoxProps & { variant: BlockVariant; index: number }) => {
  const { editors } = useBlocks()

  const editor = editors[variant]

  if (!editor) return null

  return (
    <Box key={`${index}_${variant}`} p="1.25rem" h="100%" maxW="50%" {...props}>
      <Flex
        bg="white"
        border="1px solid"
        borderColor="base.divider.strong"
        flexDir="column"
        borderRadius="0.25rem"
        h="100%"
      >
        {variant === "embed" && <EmbedMenuBar editor={editor} />}
        {variant === "text" && <TextMenuBar editor={editor} />}
        {variant === "table" && <TableMenuBar editor={editor} />}
        {variant === "image" && <ImageMenuBar editor={editor} />}
        <LinkBubbleMenu editor={editor} />
        <TableBubbleMenu editor={editor} />
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
