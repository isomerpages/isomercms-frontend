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
import { BubbleMenu, Editor } from "@tiptap/react"
import { useState } from "react"

import { useEditorContext } from "contexts/EditorContext"

interface LinkBubbleMenuProps {
  editor?: Editor
}

const LinkButton = ({ editor: passedEditor }: LinkBubbleMenuProps) => {
  const { editor: contextEditor } = useEditorContext()
  const { onClose, onOpen, isOpen } = useDisclosure()
  const [href, setHref] = useState("")
  const editor = passedEditor || contextEditor

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
        onClick={onOpen}
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

export const LinkBubbleMenu = ({
  editor: passedEditor,
}: LinkBubbleMenuProps) => {
  const { editor: contextEditor } = useEditorContext()
  const editor = passedEditor || contextEditor

  return (
    <BubbleMenu
      shouldShow={() => editor.isActive("link")}
      editor={editor}
      tippyOptions={{ duration: 100 }}
    >
      <LinkButton editor={editor} />
    </BubbleMenu>
  )
}
