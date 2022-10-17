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

export const PendingApprovalModal = (
  props: Omit<ModalProps, "children">
): JSX.Element => {
  const { onClose } = props

  return (
    <Modal {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text textStyle="h4" textColor="text.title.alt">
            A Review request is pending approval
          </Text>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Text textStyle="body-1">
            Any changes you make now will be added to the existing Review
            request, and published with the changes in it.
          </Text>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="clear"
            mr="1rem"
            onClick={onClose}
            colorScheme="secondary"
            textColor="text.title.brandSecondary"
          >
            Back to Site Dashboard
          </Button>
          <Button>Continue to edit</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
