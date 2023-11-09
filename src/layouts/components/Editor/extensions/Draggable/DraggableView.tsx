import { Box, Flex } from "@chakra-ui/react"
import { Tag } from "@opengovsg/design-system-react"
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react"

import { BxDraggableVertical } from "assets"

const draggableStyles = {
  padding: "0.5rem",
  margin: "0.5rem 0",
  borderRadius: "0.5rem",
  background: "white",
  boxShadow: `0 0 0 1px rgba(0, 0, 0, 0.05),
      0px 10px 20px rgba(0, 0, 0, 0.1)`,
}

export const DraggableView = ({ node }: NodeViewProps) => {
  return (
    <Box as={NodeViewWrapper} {...draggableStyles}>
      <Box w="100%">
        <Flex flexDir="row" alignItems="center">
          <Box
            alignSelf="center"
            cursor="grab"
            aria-label="drag item"
            mr="0.5rem"
            contentEditable="false"
            draggable
            data-drag-handle
          >
            <BxDraggableVertical />
          </Box>
          <Tag _hover={{}} _active={{}}>
            {node.child(0).type.name}
          </Tag>
        </Flex>
        <NodeViewContent />
      </Box>
    </Box>
  )
}
