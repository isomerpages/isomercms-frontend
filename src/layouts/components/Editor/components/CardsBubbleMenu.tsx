import {
  Box,
  Drawer,
  HStack,
  Icon,
  SlideFade,
  useDisclosure,
} from "@chakra-ui/react"
import { IconButton } from "@opengovsg/design-system-react"
import { BubbleMenu } from "@tiptap/react"
import { BiPencil, BiTrash } from "react-icons/bi"

import { useEditorContext } from "contexts/EditorContext"

const CardsButton = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <HStack
        bgColor="#fafafa"
        borderRadius="0.25rem"
        border="1px solid"
        borderColor="base.divider.medium"
        px="0.5rem"
        py="0.25rem"
      >
        <IconButton
          _hover={{ bg: "gray.100" }}
          _active={{ bg: "gray.200" }}
          onClick={onOpen}
          bgColor="transparent"
          border="none"
          h="1.75rem"
          w="1.75rem"
          minH="1.75rem"
          minW="1.75rem"
          p="0.25rem"
          aria-label="edit cards block"
        >
          <Icon as={BiPencil} fontSize="1.25rem" color="base.content.medium" />
        </IconButton>
        <IconButton
          _hover={{ bg: "gray.100" }}
          _active={{ bg: "gray.200" }}
          onClick={() => console.log("clicked")}
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
        placement: "top-end",
        offset: [0, -16],
      }}
    >
      <CardsButton />
    </BubbleMenu>
  )
}
