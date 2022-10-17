import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalProps,
  Text,
} from "@chakra-ui/react"
import { Button, ModalCloseButton } from "@opengovsg/design-system-react"

export const CancelRequestModal = (
  props: Omit<ModalProps, "children">
): JSX.Element => {
  const { onClose } = props

  return (
    <Modal {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text textStyle="h4" color="text.title.alt">
            Cancel request?
          </Text>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Text textStyle="body-2">
            The request to review will be cancelled but changes made will
            remain.
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button
            textColor="text.body"
            variant="clear"
            mr="1rem"
            onClick={onClose}
          >
            Go back
          </Button>
          <Button colorScheme="danger">Yes, cancel</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
