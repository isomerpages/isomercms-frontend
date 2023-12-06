import { HStack, Icon, useDisclosure } from "@chakra-ui/react"
import { IconButton, Tooltip } from "@opengovsg/design-system-react"
import { BubbleMenu, getHTMLFromFragment } from "@tiptap/react"
import { BiPencil, BiTrash } from "react-icons/bi"

import { EditorEmbedModal } from "components/EditorEmbedModal"

import { useEditorContext } from "contexts/EditorContext"

import { useCspHook } from "hooks/settingsHooks"

import { isEmbedCodeValid } from "utils/allowedHTML"
import { isEmbedActive } from "utils/tiptap"

import { EditorEmbedContents } from "types/editPage"

const EmbedButton = () => {
  const {
    isOpen: isEmbedModalOpen,
    onOpen: onEmbedModalOpen,
    onClose: onEmbedModalClose,
  } = useDisclosure()
  const { editor } = useEditorContext()
  const { data: csp } = useCspHook()

  const handleEmbedInsert = ({ value }: EditorEmbedContents) => {
    if (isEmbedCodeValid(csp, value)) {
      editor.chain().focus().insertContent(value.replaceAll("\n", "")).run()
    }

    onEmbedModalClose()
  }

  return (
    <>
      <EditorEmbedModal
        isOpen={isEmbedModalOpen}
        onClose={onEmbedModalClose}
        onProceed={handleEmbedInsert}
        cursorValue={
          editor.state.selection.empty
            ? ""
            : getHTMLFromFragment(
                editor.state.selection.content().content,
                editor.schema
              )
        }
      />

      <HStack
        bgColor="#fafafa"
        borderRadius="0.25rem"
        border="1px solid"
        borderColor="base.divider.medium"
        boxShadow="0px 8px 12px 0px rgba(187, 187, 187, 0.50)"
        px="0.5rem"
        py="0.25rem"
      >
        <Tooltip label="Edit embed" hasArrow placement="top">
          <IconButton
            _hover={{ bg: "gray.100" }}
            _active={{ bg: "gray.200" }}
            onClick={onEmbedModalOpen}
            bgColor="transparent"
            border="none"
            h="1.75rem"
            w="1.75rem"
            minH="1.75rem"
            minW="1.75rem"
            p="0.25rem"
            aria-label="edit embed code"
          >
            <Icon
              as={BiPencil}
              fontSize="1.25rem"
              color="base.content.medium"
            />
          </IconButton>
        </Tooltip>
        <Tooltip label="Delete embed" hasArrow placement="top">
          <IconButton
            _hover={{ bg: "gray.100" }}
            _active={{ bg: "gray.200" }}
            onClick={() => editor.chain().focus().deleteIframe().run()}
            bgColor="transparent"
            border="none"
            h="1.75rem"
            w="1.75rem"
            minH="1.75rem"
            minW="1.75rem"
            p="0.25rem"
            aria-label="delete embed content"
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

export const EmbedBubbleMenu = () => {
  const { editor } = useEditorContext()

  return (
    <BubbleMenu
      shouldShow={() => isEmbedActive(editor)}
      editor={editor}
      tippyOptions={{
        duration: 100,
        placement: "top-end",
        offset: [0, -16],
        zIndex: 0,
      }}
    >
      <EmbedButton />
    </BubbleMenu>
  )
}
