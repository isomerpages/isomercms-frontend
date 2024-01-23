import {
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
} from "@chakra-ui/react"
import { Button, ModalCloseButton } from "@opengovsg/design-system-react"

interface EditorDrawerCloseWarningModalProps {
  name: string
  isOpen: boolean
  onClose: () => void
  onProceed: () => void
}

export const EditorDrawerCloseWarningModal = ({
  name,
  isOpen,
  onClose,
  onProceed,
}: EditorDrawerCloseWarningModalProps): JSX.Element => {
  return (
    <Modal motionPreset="none" isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Are you sure you want to exit {name} editing?</ModalHeader>

        <ModalCloseButton />

        <ModalBody>
          <Text>
            You haven’t saved your edits to the {name}. If you exit edit mode,
            you will lose all your unsaved changes.
          </Text>
        </ModalBody>

        <ModalFooter>
          <HStack w="100%" spacing="1rem" justifyContent="flex-end">
            <Button variant="clear" colorScheme="neutral" onClick={onClose}>
              Go back to {name}
            </Button>
            <Button colorScheme="critical" onClick={onProceed}>
              Exit {name} editing
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
