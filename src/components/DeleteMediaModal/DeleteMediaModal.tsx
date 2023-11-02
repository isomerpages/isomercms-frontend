import {
  Box,
  HStack,
  Icon,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Tr,
  VStack,
} from "@chakra-ui/react"
import {
  Button,
  Checkbox,
  ModalCloseButton,
} from "@opengovsg/design-system-react"
import { useState } from "react"
import { BiImage } from "react-icons/bi"

import { MediaLabels, SelectedMediaDto } from "types/media"
import { getReadableFileSize } from "utils"

interface DeleteMediaModalProps {
  selectedMedia: SelectedMediaDto[]
  mediaLabels: MediaLabels
  isWriteDisabled: boolean | undefined
  isOpen: boolean
  isLoading: boolean
  onClose: () => void
  onProceed: (selectedMedia: SelectedMediaDto[]) => void
}

export const DeleteMediaModal = ({
  selectedMedia,
  mediaLabels,
  isWriteDisabled,
  isOpen,
  isLoading,
  onClose,
  onProceed,
}: DeleteMediaModalProps): JSX.Element => {
  const { singularMediaLabel, pluralMediaLabel } = mediaLabels
  const [isDeleteChecked, setIsDeleteChecked] = useState(false)

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />

        {selectedMedia.length === 1 && (
          <>
            <ModalHeader>
              <Text as="h4" textStyle="h4">
                Delete {selectedMedia[0].filePath.split("/").pop()}?
              </Text>
            </ModalHeader>

            <ModalBody mt="1rem">
              Are you sure you want to delete this {singularMediaLabel}? If you
              used this {singularMediaLabel} on any page, site visitors may see
              a broken {singularMediaLabel}. This cannot be undone.
            </ModalBody>
          </>
        )}

        {selectedMedia.length > 1 && (
          <>
            <ModalHeader>
              <Text as="h4" textStyle="h4">
                Delete {selectedMedia.length} {pluralMediaLabel}?
              </Text>
            </ModalHeader>

            <ModalBody mt="1rem">
              <VStack spacing="1.5rem">
                <Text as="p" textStyle="body-1">
                  Are you sure you want to delete {selectedMedia.length}{" "}
                  {pluralMediaLabel}?
                  <br />
                  <br />
                  If you used any of these {pluralMediaLabel} on a page, your
                  site visitors may see broken {pluralMediaLabel}. This cannot
                  be undone.
                </Text>

                <Box w="100%">
                  <Text textStyle="subhead-1">Selected images</Text>
                  <Text textStyle="caption-2" mt="0.25rem">
                    {selectedMedia.length} {pluralMediaLabel} will be deleted
                  </Text>
                  <TableContainer
                    mt="0.75rem"
                    overflowY="scroll"
                    maxH="14.5rem"
                  >
                    <Table variant="simple">
                      <Tbody borderTop="1px" borderColor="gray.100">
                        {selectedMedia.map((selectedMediaData) => (
                          <Tr key={selectedMediaData.filePath}>
                            <Td w="2.75rem" lineHeight="0.5rem">
                              <Icon as={BiImage} fontSize="1rem" />
                            </Td>
                            <Td>
                              <Text textStyle="caption-2" noOfLines={1}>
                                {selectedMediaData.filePath.split("/").pop()}
                              </Text>
                            </Td>
                            <Td w="7.5rem">
                              <Text textStyle="caption-2">
                                {getReadableFileSize(selectedMediaData.size)}
                              </Text>
                            </Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </TableContainer>
                </Box>
              </VStack>
            </ModalBody>
          </>
        )}

        <ModalFooter>
          <HStack w="100%" spacing={4} justifyContent="flex-end" mt="0.5rem">
            <Checkbox onChange={(e) => setIsDeleteChecked(e.target.checked)}>
              Yes, delete{" "}
              {selectedMedia.length === 1
                ? singularMediaLabel
                : `all ${selectedMedia.length} ${pluralMediaLabel}`}
            </Checkbox>
            <Button variant="clear" colorScheme="neutral" onClick={onClose}>
              Cancel
            </Button>
            <Button
              colorScheme="critical"
              isLoading={isLoading}
              onClick={() => {
                setIsDeleteChecked(false)
                onProceed(selectedMedia)
              }}
              isDisabled={isWriteDisabled || !isDeleteChecked}
            >
              Delete{" "}
              {selectedMedia.length === 1
                ? singularMediaLabel
                : pluralMediaLabel}
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
