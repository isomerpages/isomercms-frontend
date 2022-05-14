import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Text,
  HStack,
  Divider,
  VStack,
  useDisclosure,
} from "@chakra-ui/react"
import { ModalCloseButton, Button } from "@opengovsg/design-system-react"

// eslint-disable-next-line import/prefer-default-export
export const DirectoryCreationModal = ({
  onSubmit,
  directoryType,
  children,
  isLoading,
}) => {
  const { isOpen, onClose } = useDisclosure()
  return (
    <Modal
      onClose={onClose}
      size="full"
      isOpen={isOpen}
      scrollBehavior="inside"
    >
      <ModalOverlay />
      <ModalContent pt={24.5} bgColor="#F9F9F9">
        <ModalCloseButton colorScheme="primary" />
        {/*
         * NOTE: We have to set padding separately for header/body;
         * This is because using a box and setting flex = 1 + padding causes the scrollbar to not appear
         */}
        <ModalHeader paddingInline="264px">
          <VStack spacing={1.5} align="flex-start">
            <Text textStyle="display-2">
              {`Select items to add into '${directoryType}'`}
            </Text>
            <Text textStyle="body-2">
              Pages will be ordered by the order of selection
            </Text>
          </VStack>
        </ModalHeader>
        <ModalBody px="264px">
          <VStack spacing="46px" mt={8} align="flex-start">
            <Divider borderColor="#E9E9E9" />
            <Text textStyle="body-2">Ungrouped pages</Text>
            {children}
          </VStack>
        </ModalBody>
        <ModalFooter bg="white" borderTop="1px solid" borderColor="#E9E9E9">
          <HStack spacing={2}>
            <Button onClick={onClose} variant="clear">
              Cancel
            </Button>
            <Button isLoading={isLoading} onClick={onSubmit}>
              Save
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
