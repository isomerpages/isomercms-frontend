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

export const EditingBlockedModal = (
  props: Omit<ModalProps, "children">
): JSX.Element => {
  const { onClose } = props

  return (
    <Modal {...props}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <Text textStyle="h4" textColor="text.title.alt">
            Changes can’t be made to approved requests
          </Text>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Text textStyle="body-1">
            If you want to add changes to the approved request, ask a reviewer
            to undo approval. To make other changes, publish the approved
            changes first.
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
          <Button>Go to Review request</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
