import {
  Text,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react"
import { ModalCloseButton } from "@opengovsg/design-system-react"
import parse from "html-react-parser"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  displayTitle: string
  displayText: string
  children: JSX.Element | JSX.Element[]
}

export const GenericWarningModal = ({
  isOpen,
  onClose,
  displayTitle,
  displayText,
  children,
}: ModalProps): JSX.Element => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>
        <Text pr="2rem">{displayTitle}</Text>
      </ModalHeader>
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
