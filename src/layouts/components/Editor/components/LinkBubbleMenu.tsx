import {
  useDisclosure,
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
import { useEffect } from "react"
import { useForm } from "react-hook-form"

import { Modal } from "components/Modal"

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
    setValue,
  } = useForm({
    mode: "onTouched",
    defaultValues: {
      href: "", // we don't set default values here since this does not change on component re-open
    },
  })

  useEffect(() => {
    // set default values here instead
    const { href } = editor.getAttributes("link")
    setValue("href", href)
    // only done once per every time the modal is opened
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen])

  const href = watch("href")

  const onSubmit = () => {
    if (href) {
      editor
        .chain()
        .extendMarkRange("link")
        // NOTE: Force `https` by default
        .setLink({ href })
        .run()
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
            linkHref &&
            linkHref.startsWith("/") &&
            linkHref.split("/").at(1) === "files"
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
