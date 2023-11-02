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
          const { href: _linkHref } = editor.getAttributes("link")
          const linkHref = _linkHref as string
          // NOTE: We only allow `mailto` and `http` protocols for our absolute links
          // otherwise, they are relative links.
          if (
            linkHref.startsWith("http") ||
            linkHref.startsWith("mailto") ||
            // NOTE: Files are always guaranteed to be inside `/files`.
            // If users use a relative link (from inside a page), it will be situated outside
            // of the `files` folder, so this invariant still holds.
            (linkHref.startsWith("/") && linkHref.split("/").at(1) !== "files")
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
              <Input
                defaultValue={
                  (editor.getAttributes("link").href as string) || ""
                }
                onChange={(event) => setHref(event.target.value)}
              />
            </InputGroup>
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              mr={3}
              onClick={() => {
                if (href) {
                  editor
                    .chain()
                    .focus()
                    // NOTE: Force `https` by default
                    .setLink({ href })
                    .run()
                } else {
                  editor.chain().focus().unsetLink().run()
                }
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
