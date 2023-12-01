import { Box, Text } from "@chakra-ui/react"
import { NodeViewProps, NodeViewWrapper } from "@tiptap/react"

import { BlockWrapper } from "../../components/BlockWrapper"

export const FormSGView = ({ node, selected }: NodeViewProps) => {
  const formSrc = node.content.child(1).attrs.src

  return (
    <BlockWrapper name="FormSG embed" isSelected={selected}>
      <Box
        as={NodeViewWrapper}
        bg="#FAF594"
        border="3px solid #0d0d0d"
        borderRadius="0.5rem"
        margin="1rem 0"
        position="relative"
        data-drag-handle
        contentEditable={false}
      >
        <Text
          ml="1rem"
          bgColor="#0d0d0d"
          textStyle="caption-1"
          fontWeight="bold"
          color="#fff"
          position="absolute"
          top="0"
          padding="0.25rem 0.75rem"
          borderRadius="0 0 0.5rem 0.5rem"
        >
          FormSG Embed
        </Text>
        <Box mt="1.5rem" p="1rem">
          {formSrc}
        </Box>
      </Box>
    </BlockWrapper>
  )
}
