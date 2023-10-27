import { Box, Text } from "@chakra-ui/react"
import { IconButton } from "@opengovsg/design-system-react"
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react"

import { BxDraggableVertical } from "assets"

const draggableStyles = {
  display: "flex",
  padding: "0.5rem",
  margin: "0.5rem 0",
  borderRadius: "0.5rem",
  background: "white",
  boxShadow: `0 0 0 1px rgba(0, 0, 0, 0.05),
      0px 10px 20px rgba(0, 0, 0, 0.1)`,
}

export const DraggableView = () => {
  return (
    <Box as={NodeViewWrapper} {...draggableStyles}>
      <Box
        alignSelf="center"
        // variant="clear"
        cursor="grab"
        aria-label="drag item"
        mr="0.5rem"
        contentEditable="false"
        draggable
        data-drag-handle
        // icon={<BxDraggableVertical />}
      >
        <BxDraggableVertical />
      </Box>
      <NodeViewContent />
    </Box>
  )
}
