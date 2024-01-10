import "./styles.scss"

import {
  Box,
  BoxProps,
  Divider,
  Flex,
  Icon,
  Link,
  Text,
} from "@chakra-ui/react"
import { Infobox } from "@opengovsg/design-system-react"
import { EditorContent } from "@tiptap/react"
import { BiLinkExternal } from "react-icons/bi"

import { useEditorContext } from "contexts/EditorContext"

import { LinkBubbleMenu, MenuBar, TableBubbleMenu } from "./components"
import { CardsBubbleMenu } from "./components/CardsBubbleMenu"
import { EmbedBubbleMenu } from "./components/EmbedBubbleMenu"
import { ImageBubbleMenu } from "./components/ImageBubbleMenu"

export const Editor = (props: BoxProps & { showInfoBox: boolean }) => {
  const { editor } = useEditorContext()
  const { showInfoBox } = props

  return (
    <Box p="1.25rem" h="100%" maxW="50%" minW="40%" {...props}>
      {showInfoBox && (
        <Infobox my="1.5rem" variant="info">
          <Text>
            You are using Isomer’s new no-code editor.{" "}
            <Link
              isExternal
              href="https://guide.isomer.gov.sg/guide/your-workspace/pages/new-editor-editing-page"
            >
              Read more about the new editor here{" "}
              <Icon as={BiLinkExternal} color="icon.default" />
            </Link>
            <br />
            You can switch back to the legacy editor anytime in Page Settings.
          </Text>
        </Infobox>
      )}

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
        <ImageBubbleMenu />
        <TableBubbleMenu />
        <CardsBubbleMenu />
        <EmbedBubbleMenu />
        <Box
          as={EditorContent}
          editor={editor}
          flex="1 1 auto"
          overflowX="hidden"
          overflowY="auto"
          px="2rem"
          py="1rem"
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
