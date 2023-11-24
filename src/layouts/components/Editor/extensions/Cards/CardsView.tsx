import { Box, Text } from "@chakra-ui/react"
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react"

import { EditorCardsPlaceholderImage } from "assets"

export const CardsView = ({ node, selected }: NodeViewProps) => {
  return (
    <Box as={NodeViewWrapper} data-drag-handle>
      <Box position="relative">
        {selected && (
          <Box
            position="absolute"
            top="calc(-2.25rem - 2px)"
            left="calc(-0.75rem - 2px)"
            zIndex="1"
            backgroundColor="#055AFF"
            textColor="white"
            p="0.25rem"
          >
            <Text textStyle="caption-1">Cards grid</Text>
          </Box>
        )}
        <Box
          outline={selected ? "2px solid #055AFF" : undefined}
          outlineOffset="0.75rem"
          w="fit-content"
        >
          <EditorCardsPlaceholderImage />
        </Box>
      </Box>
    </Box>
  )
}
