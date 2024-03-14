import { Box, HStack, Icon, IconButton, Tooltip } from "@chakra-ui/react"
import { NodeViewContent, NodeViewProps } from "@tiptap/react"
import { BiPencil, BiPlus, BiTrash } from "react-icons/bi"

import { useEditorDrawerContext } from "contexts/EditorDrawerContext"

import { BlockWrapper } from "../../components/BlockWrapper"

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
  const otherButtons = (
    <>
      <Box
        display={selected ? "block" : "none"}
        position="absolute"
        width="100%"
      >
        <HStack
          borderColor="base.divider.medium"
          display="flex"
          justifyContent="flex-end"
        >
          <Box
            backgroundColor={selected ? "white" : "transparent"}
            marginTop="-0.25rem"
            boxShadow="0px 0px 4px 0px rgba(0, 0, 0, 0.8)"
            borderRadius="4px"
          >
            <Tooltip label="Edit accordion grid" hasArrow placement="top">
              <IconButton
                _hover={{ bg: "gray.100" }}
                _active={{ bg: "gray.200" }}
                onClick={onDrawerOpen("accordion")}
                bgColor="transparent"
                border="none"
                h="1.75rem"
                w="1.75rem"
                minH="1.75rem"
                minW="1.75rem"
                p="0.25rem"
                aria-label="edit accordion block"
              >
                <Icon
                  as={BiPencil}
                  fontSize="1.25rem"
                  color="base.content.medium"
                />
              </IconButton>
            </Tooltip>
            <Tooltip label="Delete accordion " hasArrow placement="top">
              <IconButton
                _hover={{ bg: "gray.100" }}
                _active={{ bg: "gray.200" }}
                onClick={() => {
                  editor.chain().focus().unsetDetailsGroup().run()
                }}
                bgColor="transparent"
                border="none"
                h="1.75rem"
                w="1.75rem"
                minH="1.75rem"
                minW="1.75rem"
                p="0.25rem"
                aria-label="delete accordion block"
              >
                <Icon
                  as={BiTrash}
                  fontSize="1.25rem"
                  color="interaction.critical.default"
                />
              </IconButton>
            </Tooltip>
          </Box>
        </HStack>
      </Box>
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
    </>
  )
  return (
    <BlockWrapper
      name="Accordion grid"
      isSelected={selected}
      childButtons={otherButtons}
      padding-top="0.5rem"
      padding-bottom="0.5rem"
    >
      <Box
        borderColor="base.divider.strong"
        borderWidth="1px"
        mt="1rem"
        h="100%"
        w="100%"
      >
        <NodeViewContent />
      </Box>
    </BlockWrapper>
  )
}
