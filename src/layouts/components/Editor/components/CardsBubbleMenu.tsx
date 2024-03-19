import { HStack, Icon } from "@chakra-ui/react"
import { IconButton, Tooltip } from "@opengovsg/design-system-react"
import { BubbleMenu } from "@tiptap/react"
import { BiPencil, BiTrash } from "react-icons/bi"

import { useEditorContext } from "contexts/EditorContext"
import { useEditorDrawerContext } from "contexts/EditorDrawerContext"

const CardsButton = () => {
  const { onDrawerOpen } = useEditorDrawerContext()
  const { editor } = useEditorContext()

  return (
    <>
      <HStack
        bgColor="#fafafa"
        borderRadius="0.25rem"
        border="1px solid"
        borderColor="base.divider.medium"
        boxShadow="sm"
        px="0.5rem"
        py="0.25rem"
      >
        <Tooltip label="Edit card grid" hasArrow placement="top">
          <IconButton
            _hover={{ bg: "gray.100" }}
            _active={{ bg: "gray.200" }}
            onClick={onDrawerOpen("cards")}
            bgColor="transparent"
            border="none"
            h="1.75rem"
            w="1.75rem"
            minH="1.75rem"
            minW="1.75rem"
            p="0.25rem"
            aria-label="edit cards block"
          >
            <Icon
              as={BiPencil}
              fontSize="1.25rem"
              color="base.content.medium"
            />
          </IconButton>
        </Tooltip>
        <Tooltip label="Delete card grid" hasArrow placement="top">
          <IconButton
            _hover={{ bg: "gray.100" }}
            _active={{ bg: "gray.200" }}
            onClick={() => editor.chain().focus().deleteCards().run()}
            bgColor="transparent"
            border="none"
            h="1.75rem"
            w="1.75rem"
            minH="1.75rem"
            minW="1.75rem"
            p="0.25rem"
            aria-label="delete cards block"
          >
            <Icon
              as={BiTrash}
              fontSize="1.25rem"
              color="interaction.critical.default"
            />
          </IconButton>
        </Tooltip>
      </HStack>
    </>
  )
}

export const CardsBubbleMenu = () => {
  const { editor } = useEditorContext()

  return (
    <BubbleMenu
      shouldShow={() => editor.isActive("isomercards")}
      editor={editor}
      tippyOptions={{
        duration: 100,
        placement: "top-start",
        offset: [511, -16],
        zIndex: 0,
      }}
    >
      <CardsButton />
    </BubbleMenu>
  )
}
