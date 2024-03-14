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

  // todo: get drawer reviewed in staging
  const isProd = process.env.REACT_APP_ENV === "production"

  const otherButtons = (
    <>
      <Box
        display={selected ? "flex" : "none"}
        position="absolute"
        width="100%"
        justifyContent="end"
      >
        <HStack
          bgColor="interaction.mainLight.default"
          borderRadius="0.25rem"
          border="1px solid"
          borderColor="base.divider.medium"
          boxShadow="0px 8px 12px 0px rgba(187, 187, 187, 0.50)"
          px="0.5rem"
          py="0.25rem"
          mr="-0.5rem"
          mt="-1.5rem"
        >
          {!isProd && (
            <Tooltip label="Edit accordion block" hasArrow placement="top">
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
          )}

          <Tooltip label="Delete accordion block" hasArrow placement="top">
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
      name="Accordion"
      isSelected={selected}
      childButtons={otherButtons}
      padding-top="0.5rem"
      padding-bottom="0.5rem"
    >
      <Box
        borderColor="base.divider.strong"
        h="100%"
        w="100%"
        borderTop="1px solid #d4d4d4"
        borderBottom="1px solid #d4d4d4"
      >
        <NodeViewContent />
      </Box>
    </BlockWrapper>
  )
}
