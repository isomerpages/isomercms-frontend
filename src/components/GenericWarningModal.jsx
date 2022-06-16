import {
  Text,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import parse from "html-react-parser"

const GenericWarningModal = ({
  isOpen,
  onClose,
  displayTitle,
  displayText,
  children,
}) => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>{displayTitle}</ModalHeader>
      <ModalCloseButton />
      <ModalBody>
        <Text textStyle="body-2">{parse(displayText)}</Text>
      </ModalBody>
      <ModalFooter>
        <HStack w="100%" spacing={2} justifyContent="flex-end">
          {children}
        </HStack>
      </ModalFooter>
    </ModalContent>
  </Modal>
)

export default GenericWarningModal
