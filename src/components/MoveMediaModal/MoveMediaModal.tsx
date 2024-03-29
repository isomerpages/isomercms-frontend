import {
  Box,
  HStack,
  Icon,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Skeleton,
  Text,
  VStack,
} from "@chakra-ui/react"
import {
  Button,
  Infobox,
  ModalCloseButton,
} from "@opengovsg/design-system-react"
import { AxiosError } from "axios"
import _ from "lodash"
import { useEffect, useState } from "react"
import { BiArrowBack, BiFolderOpen } from "react-icons/bi"
import { UseMutateFunction } from "react-query"
import { useParams } from "react-router-dom"

import { Breadcrumbs } from "components/Breadcrumbs"
import { Modal } from "components/Modal"
import { DirMenuItem, FileMenuItem } from "components/move/MoveMenuItem"

import {
  useListMediaFolderFiles,
  useListMediaFolderSubdirectories,
} from "hooks/directoryHooks"

import { MiddlewareError } from "types/error"
import {
  MediaFolderTypes,
  MediaLabels,
  MoveSelectedMediaDto,
  SelectedMediaDto,
} from "types/media"

interface MoveMediaModalProps {
  selectedMedia: SelectedMediaDto[]
  mediaType: MediaFolderTypes
  mediaLabels: MediaLabels
  isWriteDisabled: boolean | undefined
  isOpen: boolean
  isLoading: boolean
  onClose: () => void
  onProceed: UseMutateFunction<
    void,
    AxiosError<MiddlewareError>,
    MoveSelectedMediaDto,
    unknown
  >
}

const getPathTokens = (filePath: string) => {
  return decodeURIComponent(filePath).split("/")
}

const getLastChildOfPath = (filePath: string) => {
  return getPathTokens(filePath).pop() || ""
}

const getAllParentsOfPath = (filePath: string) => {
  return getPathTokens(filePath).slice(0, -1) || []
}

export const MoveMediaModal = ({
  selectedMedia,
  mediaType,
  mediaLabels,
  isWriteDisabled,
  isOpen,
  isLoading,
  onClose,
  onProceed,
}: MoveMediaModalProps): JSX.Element => {
  const { siteName } = useParams<{ siteName: string }>()
  const { singularMediaLabel, pluralMediaLabel } = mediaLabels

  const [moveTo, setMoveTo] = useState<string>(mediaType)

  const {
    data: mediaSubdirectories,
    isLoading: isSubdirectoriesLoading,
  } = useListMediaFolderSubdirectories({
    siteName,
    mediaDirectoryName: encodeURIComponent(moveTo),
  })

  const {
    data: mediaFilesData,
    isLoading: isMediaFilesLoading,
  } = useListMediaFolderFiles({
    siteName,
    mediaDirectoryName: encodeURIComponent(moveTo),
  })

  const onModalClose = () => {
    setMoveTo(mediaType)
    onClose()
  }

  useEffect(() => {
    // Note: This useEffect is needed to reset the state of the modal when it
    // is closed and reopened. This is because the modal is not unmounted when
    // it is closed.
    setMoveTo(mediaType)
  }, [mediaType, isOpen])

  return (
    <Modal isOpen={isOpen} onClose={onModalClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalCloseButton />

        <ModalHeader>
          <Text as="h4" textStyle="h4" mr="2.5rem">
            Move{" "}
            {selectedMedia.length === 1
              ? getLastChildOfPath(selectedMedia[0].filePath)
              : `${selectedMedia.length} ${pluralMediaLabel}`}
          </Text>
        </ModalHeader>

        <ModalBody mt="1rem">
          <VStack spacing="1.5rem">
            <Infobox variant="warning">
              Moving an {singularMediaLabel} to a different folder might lead to
              broken {pluralMediaLabel} on pages. This confuses site visitors.
              Ensure that your pages are displaying the correct{" "}
              {pluralMediaLabel}.
            </Infobox>

            {selectedMedia.length === 1 && (
              <Box w="100%">
                <Text textStyle="subhead-1">
                  {_.upperFirst(singularMediaLabel)} is currently located in
                </Text>
                <Text textStyle="body-2">
                  <Breadcrumbs
                    items={[
                      ...getAllParentsOfPath(selectedMedia[0].filePath).map(
                        (item) => ({
                          title: _.upperFirst(item),
                        })
                      ),
                      {
                        title: getLastChildOfPath(selectedMedia[0].filePath),
                      },
                    ]}
                    maxBreadcrumbsLength={4}
                    spacing="0rem"
                    textStyle="body-2"
                    isLinked={false}
                    isLastChildUnderlined
                  />
                </Text>
              </Box>
            )}

            <Box
              w="100%"
              borderWidth="1px"
              borderColor="base.divider.medium"
              borderRadius="0.25rem"
            >
              <Box
                w="100%"
                bgColor="background.action.infoInverse"
                borderColor="base.divider.medium"
                borderBottomWidth="1px"
                px="1rem"
                py="0.875rem"
                color="base.content.strong"
              >
                <HStack spacing="1rem">
                  {moveTo === mediaType ? (
                    <Icon as={BiFolderOpen} fontSize="1.25rem" />
                  ) : (
                    <Button
                      variant="clear"
                      color="base.content.strong"
                      borderWidth={0}
                      p={0}
                      h="1.5rem"
                      minH="1.25rem"
                      minW="1.25rem"
                      onClick={() =>
                        setMoveTo(getAllParentsOfPath(moveTo).join("/"))
                      }
                    >
                      <Icon as={BiArrowBack} fontSize="1.25rem" />
                    </Button>
                  )}
                  <Text textStyle="subhead-1" noOfLines={1}>
                    {_.upperFirst(getLastChildOfPath(moveTo) || mediaType)}
                  </Text>
                </HStack>
              </Box>

              <Box w="100%" h="12rem" overflow="scroll">
                <Skeleton
                  h="100%"
                  isLoaded={!isSubdirectoriesLoading && !isMediaFilesLoading}
                >
                  {/* Directories */}
                  {mediaSubdirectories?.directories.map(
                    (subdirectory, itemIndex) => (
                      <DirMenuItem
                        key={subdirectory.name}
                        name={subdirectory.name}
                        id={itemIndex}
                        onClick={() => {
                          setMoveTo([moveTo, subdirectory.name].join("/"))
                        }}
                      />
                    )
                  )}

                  {/* Files */}
                  {mediaFilesData?.files.map((file, itemIndex) => (
                    <FileMenuItem
                      key={file.name}
                      name={file.name}
                      id={itemIndex}
                    />
                  ))}

                  {/* Empty state */}
                  {mediaSubdirectories?.directories.length === 0 &&
                    mediaFilesData?.files.length === 0 && (
                      <Box
                        w="100%"
                        color="grey.500"
                        pl="1rem"
                        pr="1.25rem"
                        py="0.75rem"
                      >
                        <Text textStyle="body-1">
                          No {pluralMediaLabel} here yet.
                        </Text>
                      </Box>
                    )}
                </Skeleton>
              </Box>
            </Box>

            <Box w="100%">
              <Text textStyle="subhead-1">
                Move{" "}
                {selectedMedia.length === 1
                  ? singularMediaLabel
                  : pluralMediaLabel}{" "}
                to
              </Text>
              <Text textStyle="body-2">
                {/* Display the file name when only one file is moved */}
                {selectedMedia.length === 1 && (
                  <Breadcrumbs
                    items={[
                      ...getPathTokens(moveTo).map((item) => ({
                        title: _.upperFirst(decodeURIComponent(item)),
                      })),
                      {
                        title: getLastChildOfPath(selectedMedia[0].filePath),
                      },
                    ]}
                    maxBreadcrumbsLength={4}
                    spacing="0rem"
                    textStyle="body-2"
                    isLinked={false}
                    isLastChildUnderlined
                  />
                )}

                {/* Omit the file name when multiple files are moved */}
                {selectedMedia.length > 1 && (
                  <Breadcrumbs
                    items={[
                      ...getPathTokens(moveTo).map((item) => ({
                        title: _.upperFirst(decodeURIComponent(item)),
                      })),
                    ]}
                    spacing="0rem"
                    textStyle="body-2"
                    isLinked={false}
                    isLastChildUnderlined
                  />
                )}
              </Text>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <HStack w="100%" spacing={4} justifyContent="flex-end" mt="0.5rem">
            <Button
              variant="clear"
              colorScheme="neutral"
              onClick={onModalClose}
            >
              Cancel
            </Button>
            <Button
              colorScheme="main"
              isLoading={isLoading}
              onClick={() => {
                onProceed({
                  target: { directoryName: moveTo },
                  items: selectedMedia,
                })
              }}
              isDisabled={isWriteDisabled}
            >
              Move{" "}
              {selectedMedia.length === 1
                ? singularMediaLabel
                : `${selectedMedia.length} ${pluralMediaLabel}`}{" "}
              here
            </Button>
          </HStack>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
