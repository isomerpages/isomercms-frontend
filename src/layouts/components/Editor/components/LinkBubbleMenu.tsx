import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  FormControl,
} from "@chakra-ui/react"
import { Button, FormErrorMessage, Input } from "@opengovsg/design-system-react"
import { BubbleMenu } from "@tiptap/react"
import { useForm } from "react-hook-form"

import { useEditorContext } from "contexts/EditorContext"
import { useEditorModal } from "contexts/EditorModalContext"

const LinkButton = () => {
  const { editor } = useEditorContext()
  const { onClose, onOpen, isOpen } = useDisclosure()
  const { showModal } = useEditorModal()

  const {
    register,
    watch,
    formState: { errors, isValid },
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      href: (editor.getAttributes("link").href as string) || "",
    },
  })
  const href = watch("href")
  const onSubmit = () => {
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
  }
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
          const isLinkRelativeFilePath =
            linkHref.startsWith("/") && linkHref.split("/").at(1) === "files"
          if (isLinkRelativeFilePath) {
            showModal("files")
          } else {
            onOpen()
          }
        }}
      >
        Change link
      </button>
      <FormControl isRequired isInvalid={!!errors.href?.message}>
        <Modal isOpen={isOpen} onClose={onClose} size="sm">
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Update link</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Input
                id="href"
                {...register("href", { required: "Link is required" })}
              />
              <FormErrorMessage>{errors.href?.message || ""}</FormErrorMessage>
            </ModalBody>

            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                type="submit"
                onClick={onSubmit}
                isDisabled={!isValid}
              >
                Save
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </FormControl>
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
