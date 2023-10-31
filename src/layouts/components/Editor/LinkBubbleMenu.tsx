import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  InputGroup,
  InputLeftAddon,
} from "@chakra-ui/react"
import { Button, Input } from "@opengovsg/design-system-react"
import { BubbleMenu } from "@tiptap/react"
import { useState } from "react"

import { useEditorContext } from "contexts/EditorContext"
import { useEditorModal } from "contexts/EditorModalContext"

const LinkButton = () => {
  const { editor } = useEditorContext()
  const { onClose, onOpen, isOpen } = useDisclosure()
  const { showModal } = useEditorModal()
  const [href, setHref] = useState("")

  return (
    <>
      <button
        // TODO: Replace with a nice looking button
        style={{
          border: "1px solid black",
          borderRadius: "5px",
          padding: "1px 6px",
          backgroundColor: "white",
        }}
        type="button"
        onClick={() => {
          // NOTE: If the link is an absolute link,
          // it's not a file on Isomer so we will just allow them to change the link
          // using the link modal.
          if (
            (editor.getAttributes("link").href as
              | string
              | undefined)?.startsWith("http")
          ) {
            onOpen()
          } else {
            // Otherwise, show the file modal
            // and let the user select a file to link to.
            showModal("files")
          }
        }}
      >
        Change link
      </button>
      <Modal isOpen={isOpen} onClose={onClose} size="sm">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Update link</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <InputGroup size="sm">
              <InputLeftAddon>https://</InputLeftAddon>
              <Input
                defaultValue={(
                  (editor.getAttributes("link").href as string) || ""
                )
                  // NOTE: trim the start of `https://` or `http://`
                  .replace(/^https?:\/\//, "")}
                onChange={(event) => setHref(event.target.value)}
              />
            </InputGroup>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                editor
                  .chain()
                  .focus()
                  // NOTE: Force `https` by default
                  .setLink({ href: `https://${href}` })
                  .run()
                onClose()
              }}
            >
              Save
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export const LinkBubbleMenu = () => {
  const { editor } = useEditorContext()

  return (
    <BubbleMenu
      shouldShow={() => editor.isActive("link")}
      editor={editor}
      tippyOptions={{ duration: 100 }}
    >
      <LinkButton />
    </BubbleMenu>
  )
}
