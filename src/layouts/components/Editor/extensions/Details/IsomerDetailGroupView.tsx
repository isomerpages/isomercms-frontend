import { Box, Icon, IconButton, Text } from "@chakra-ui/react"
import { NodeViewContent, NodeViewProps, NodeViewWrapper } from "@tiptap/react"
import { BiPencil, BiPlus } from "react-icons/bi"

import { useEditorDrawerContext } from "contexts/EditorDrawerContext"

export const IsomerDetailGroupView = ({
  node,
  editor,
  getPos,
}: NodeViewProps) => {
  const startPos = getPos()
  const endPos = startPos + node.nodeSize
  const activePos = editor.state.selection.anchor
  const selected = activePos >= startPos && activePos <= endPos
  const { onDrawerOpen } = useEditorDrawerContext()
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
          w="calc(100% - 20px)"
        >
          <NodeViewContent />
          {selected && (
            <>
              <Box
                position="absolute"
                bottom="0"
                left="50%"
                transform="translateX(-50%)"
                mb="-1.5rem"
                zIndex={1}
                background="white"
                h="2.75rem"
                w="2.75rem"
              >
                <IconButton
                  variant="outline"
                  aria-label="Add accordion"
                  icon={<Icon as={BiPlus} w="1.5rem" h="1.5rem" />}
                  onClick={() => {
                    editor.chain().appendDetail(startPos, endPos).run()
                  }}
                  position="absolute"
                  bottom="0"
                  left="50%"
                  transform="translateX(-50%)"
                  zIndex={2}
                  background="white"
                />
              </Box>
              <Box
                background="white"
                zIndex={1}
                right={0}
                top={0}
                mt="-1rem"
                mr="0.5rem"
                position="absolute"
                minH="1.75rem"
                h="1.75rem"
                minW="1.75rem"
                color="base.content.medium"
                borderColor="base.content.medium"
              >
                <IconButton
                  variant="outline"
                  aria-label="Edit accordion"
                  icon={<Icon as={BiPencil} w="1.25rem" h="1.25rem" />}
                  onClick={() => {
                    onDrawerOpen("accordion")()
                  }}
                  right={0}
                  top={0}
                  position="absolute"
                  zIndex={2}
                  background="white"
                  minH="1.75rem"
                  h="1.75rem"
                  minW="1.75rem"
                  color="base.content.medium"
                  borderColor="base.content.medium"
                />
              </Box>
            </>
          )}
        </Box>
      </Box>
    </NodeViewWrapper>
  )
}
