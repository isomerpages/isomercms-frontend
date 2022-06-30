import {
  Text,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  ModalProps,
} from "@chakra-ui/react"
import { ModalCloseButton } from "@opengovsg/design-system-react"
import { PropsWithChildren } from "react"

interface WarningModalProps extends ModalProps {
  displayTitle: string
  displayText: JSX.Element
}

export const WarningModal = ({
  displayTitle,
  displayText,
  children,
  ...rest
}: PropsWithChildren<WarningModalProps>): JSX.Element => (
  <Modal {...rest}>
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
