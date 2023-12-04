import { Box, Icon, IconButton, Text } from "@chakra-ui/react"
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react"
import { BiPlus } from "react-icons/bi"

export const IsomerDetailGroupView = ({
  node,
  editor,
  getPos,
}: NodeViewProps) => {
  const startPos = getPos()
  const endPos = startPos + node.nodeSize
  const activePos = editor.state.selection.anchor
  const selected = activePos >= startPos && activePos <= endPos
  return (
    <NodeViewWrapper data-drag-handle>
      <Box position="relative">
        {selected && (
          <Box
            position="absolute"
            top="calc(-1.5rem - 2px)"
            left="-2px"
            zIndex="1"
            backgroundColor="#055AFF"
            textColor="white"
            p="0.25rem"
          >
            <Text textStyle="caption-1">Accordion</Text>
          </Box>
        )}
        <Box
          outline={selected ? "2px solid #055AFF" : undefined}
          py="0.75rem"
          w="100%"
        >
          <NodeViewContent />
          {selected && (
            <IconButton
              variant="outline"
              aria-label="Add accordion"
              icon={<Icon as={BiPlus} w="1.5rem" h="1.5rem" />}
              onClick={() => {
                editor
                  .chain()
                  .appendDetail(startPos, endPos)

                  .run()
              }}
              position="absolute"
              bottom="0"
              left="50%"
              transform="translateX(-50%)"
              mb="-1.5rem"
              zIndex={1}
              background="white"
              // todo check with design, causes the border to be shown
              _hover={{ background: "white" }}
            />
          )}
        </Box>
      </Box>
    </NodeViewWrapper>
  )
}
