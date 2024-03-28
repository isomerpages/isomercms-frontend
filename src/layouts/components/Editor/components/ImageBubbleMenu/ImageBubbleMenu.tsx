import {
  HStack,
  Icon,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Text,
} from "@chakra-ui/react"
import { Button, IconButton, Tooltip } from "@opengovsg/design-system-react"
import { BubbleMenu } from "@tiptap/react"
import { BiLink, BiMoveHorizontal, BiTrash, BiUpload } from "react-icons/bi"

import { useEditorContext } from "contexts/EditorContext"
import { useEditorModal } from "contexts/EditorModalContext"

import { ImageAltTextPopover } from "./ImageAltTextPopover"
import { ImageHyperlinkPopover } from "./ImageHyperlinkPopover"
import { ResizeImagePopover } from "./ResizeImagePopover"

const ImageLinkButton = () => {
  const { showModal } = useEditorModal()
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
        <Tooltip label="Upload new image" hasArrow placement="top">
          <IconButton
            _hover={{ bg: "gray.100" }}
            _active={{ bg: "gray.200" }}
            onClick={() => showModal("images")}
            bgColor="transparent"
            border="none"
            h="1.75rem"
            w="1.75rem"
            minH="1.75rem"
            minW="1.75rem"
            p="0.25rem"
            aria-label="upload new image"
          >
            <Icon
              as={BiUpload}
              fontSize="1.25rem"
              color="base.content.medium"
            />
          </IconButton>
        </Tooltip>

        <Popover placement="bottom">
          {({ isOpen, onClose }) => (
            <>
              <PopoverTrigger>
                <IconButton
                  _hover={{ bg: "gray.100" }}
                  _active={{ bg: "gray.200" }}
                  bgColor={isOpen ? "gray.200" : "transparent"}
                  border="none"
                  h="1.75rem"
                  w="1.75rem"
                  minH="1.75rem"
                  minW="1.75rem"
                  p="0.25rem"
                  aria-label="upload new image"
                >
                  <Tooltip label="Add hyperlink" hasArrow placement="top">
                    <Icon
                      as={BiLink}
                      fontSize="1.25rem"
                      color="base.content.medium"
                    />
                  </Tooltip>
                </IconButton>
              </PopoverTrigger>
              <PopoverContent w="24rem" mx="1rem">
                <PopoverBody p="1rem">
                  <ImageHyperlinkPopover isOpen={isOpen} onClose={onClose} />
                </PopoverBody>
              </PopoverContent>
            </>
          )}
        </Popover>

        <Popover placement="bottom">
          {({ isOpen, onClose }) => (
            <>
              <PopoverTrigger>
                <Button
                  variant="clear"
                  colorScheme="neutral"
                  _hover={{ bg: "gray.100" }}
                  bgColor={isOpen ? "gray.200" : "transparent"}
                  size="xs"
                  minH={0}
                  minW={0}
                  paddingInline={0}
                >
                  <Text as="p" textStyle="caption-1">
                    Alt text
                  </Text>
                </Button>
              </PopoverTrigger>
              <PopoverContent w="24rem" mx="1rem">
                <PopoverBody p="1rem">
                  <ImageAltTextPopover isOpen={isOpen} onClose={onClose} />
                </PopoverBody>
              </PopoverContent>
            </>
          )}
        </Popover>

        <Popover placement="bottom">
          {({ isOpen, onClose }) => (
            <>
              <PopoverTrigger>
                <IconButton
                  _hover={{ bg: "gray.100" }}
                  bgColor={isOpen ? "gray.200" : "transparent"}
                  border="none"
                  h="1.75rem"
                  w="1.75rem"
                  minH="1.75rem"
                  minW="1.75rem"
                  p="0.25rem"
                  aria-label="resize image"
                >
                  <Tooltip label="Resize image" hasArrow placement="top">
                    <Icon
                      as={BiMoveHorizontal}
                      fontSize="1.25rem"
                      color="base.content.medium"
                    />
                  </Tooltip>
                </IconButton>
              </PopoverTrigger>
              <PopoverContent>
                <PopoverBody p="1rem">
                  <ResizeImagePopover isOpen={isOpen} onClose={onClose} />
                </PopoverBody>
              </PopoverContent>
            </>
          )}
        </Popover>

        <Tooltip label="Remove image" hasArrow placement="top">
          <IconButton
            _hover={{ bg: "gray.100" }}
            _active={{ bg: "gray.200" }}
            onClick={() => editor.chain().focus().deleteImage().run()}
            bgColor="transparent"
            border="none"
            h="1.75rem"
            w="1.75rem"
            minH="1.75rem"
            minW="1.75rem"
            p="0.25rem"
            aria-label="delete image"
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

export const ImageBubbleMenu = () => {
  const { editor } = useEditorContext()

  return (
    <BubbleMenu
      shouldShow={() => editor.isActive("image")}
      editor={editor}
      tippyOptions={{
        duration: 100,
        placement: "top-end",
        offset: [0, -16],
        zIndex: 0,
      }}
    >
      <ImageLinkButton />
    </BubbleMenu>
  )
}
