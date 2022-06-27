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
import { PropsWithChildren } from "react"

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  displayTitle: string
  displayText: JSX.Element
}

export const WarningModal = ({
  isOpen,
  onClose,
  displayTitle,
  displayText,
  children,
}: PropsWithChildren<ModalProps>): JSX.Element => (
  <Modal isOpen={isOpen} onClose={onClose}>
    <ModalOverlay />
    <ModalContent>
      <ModalHeader>
        <Text pr="2rem">{displayTitle}</Text>
      </ModalHeader>
      <ModalCloseButton />
      <ModalBody>{displayText}</ModalBody>
      <ModalFooter>
        <HStack w="100%" spacing={2} justifyContent="flex-end">
          {children}
        </HStack>
      </ModalFooter>
    </ModalContent>
  </Modal>
)
