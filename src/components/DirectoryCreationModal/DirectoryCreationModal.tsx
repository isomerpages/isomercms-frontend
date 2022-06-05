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
import { ReactChildren } from "react"
import { useFormContext } from "react-hook-form"

export interface DirectoryCreationModalProps {
  onSubmit: () => void
  isLoading: boolean
  directoryTitle: string
  directoryType: "files" | "images" | "pages"
  children: ReactChildren
  isOpen: boolean
  onClose: () => void
}

export const DirectoryCreationModal = ({
  onSubmit,
  directoryType,
  children,
  onClose,
  isLoading = false,
  isOpen = false,
}: DirectoryCreationModalProps): JSX.Element => {
  const { getValues } = useFormContext()

  const directoryTitle = getValues("newDirectoryName")

  return (
    <Modal
      onClose={onClose}
      size="full"
      // NOTE: This is required so that closing on directory modal works as expected
      // The modal is open if 1. parent wants it to be opened and 2. it's internally open
      // If the close button is clicked, 1 is true but 2 is false
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
              {`Select items to add into '${directoryTitle}'`}
            </Text>
            <Text textStyle="body-2">
              {`${directoryType} will be ordered by the order of selection`}
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
