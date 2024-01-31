import {
  Box,
  Center,
  FormControl,
  HStack,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Skeleton,
  Text,
} from "@chakra-ui/react"
import { yupResolver } from "@hookform/resolvers/yup"
import {
  Button,
  FormErrorMessage,
  FormLabel,
  Input,
  ModalCloseButton,
  Pagination,
} from "@opengovsg/design-system-react"
import { AxiosError } from "axios"
import _ from "lodash"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { UseMutateAsyncFunction } from "react-query"
import { useRouteMatch } from "react-router-dom"

import { DirectorySettingsSchema } from "components/DirectorySettingsModal"
import { ImagePreviewCard } from "components/ImagePreviewCard"
import { Modal } from "components/Modal"

import { MEDIA_PAGINATION_SIZE } from "constants/media"

import { useListMediaFolderFiles } from "hooks/directoryHooks"
import { useGetAllMediaFiles } from "hooks/directoryHooks/useGetAllMediaFiles"
import { usePaginate } from "hooks/usePaginate"

import { FilePreviewCard } from "layouts/Media/components"

import { getSelectedMediaDto } from "utils/media"
import { isWriteActionsDisabled } from "utils/reviewRequests"

import { GetMediaSubdirectoriesDto, MediaData } from "types/directory"
import { MiddlewareError } from "types/error"
import {
  MediaFolderCreationInfo,
  MediaFolderTypes,
  MediaLabels,
  SelectedMediaDto,
} from "types/media"

interface CreateMediaFolderModalProps {
  originalSelectedMedia: SelectedMediaDto[]
  mediaLabels: MediaLabels
  mediaType: MediaFolderTypes
  subDirectories: GetMediaSubdirectoriesDto | undefined
  mediaDirectoryName: string
  isOpen: boolean
  isLoading: boolean
  onClose: () => void
  onProceed: UseMutateAsyncFunction<
    void,
    AxiosError<MiddlewareError>,
    MediaFolderCreationInfo,
    unknown
  >
}

const getButtonLabel = (
  originalSelectedMedia: SelectedMediaDto[],
  filesCount: number,
  selectedMedia: SelectedMediaDto[],
  mediaLabels: MediaLabels
) => {
  const {
    singularDirectoryLabel,
    singularMediaLabel,
    pluralMediaLabel,
  } = mediaLabels

  if (originalSelectedMedia.length > 0 || filesCount === 0) {
    return `Create ${singularDirectoryLabel}`
  }

  if (selectedMedia.length > 1) {
    return `Add ${selectedMedia.length} ${pluralMediaLabel} to ${singularDirectoryLabel}`
  }

  if (selectedMedia.length === 1) {
    return `Add ${singularMediaLabel} to ${singularDirectoryLabel}`
  }

  return `Add ${pluralMediaLabel} to ${singularDirectoryLabel}`
}

export const CreateMediaFolderModal = ({
  originalSelectedMedia,
  mediaLabels,
  mediaType,
  subDirectories,
  mediaDirectoryName,
  isOpen,
  isLoading,
  onClose,
  onProceed,
}: CreateMediaFolderModalProps): JSX.Element => {
  const { params } = useRouteMatch<{
    siteName: string
  }>()
  const { siteName } = params
  const [curPage, setCurPage] = usePaginate()
  const isWriteDisabled = isWriteActionsDisabled(siteName)
  const {
    singularMediaLabel,
    pluralMediaLabel,
    singularDirectoryLabel,
  } = mediaLabels

  const existingTitles = subDirectories?.directories.map(
    (directory) => directory.name
  )

  const {
    data: mediaFolderFiles,
    isLoading: isListMediaFilesLoading,
  } = useListMediaFolderFiles({
    siteName,
    mediaDirectoryName,
    // NOTE: Subtracting 1 here because `usePaginate`
    // returns an index with 1 offset
    curPage: curPage - 1,
    limit: MEDIA_PAGINATION_SIZE,
  })

  const files = useGetAllMediaFiles(
    mediaFolderFiles?.files || [],
    siteName,
    mediaDirectoryName
  )

  const methods = useForm<MediaFolderCreationInfo>({
    mode: "onTouched",
    resolver: yupResolver(DirectorySettingsSchema(existingTitles)),
    context: {
      type: "mediaDirectoryName",
    },
    defaultValues: {
      newDirectoryName: "",
      selectedPages: originalSelectedMedia,
    },
  })

  const handleSelect = (fileData: MediaData) => {
    if (
      methods
        .getValues("selectedPages")
        .some((selectedData) => selectedData.filePath === fileData.mediaPath)
    ) {
      methods.setValue(
        "selectedPages",
        methods
          .getValues("selectedPages")
          .filter(
            (selectedData) => selectedData.filePath !== fileData.mediaPath
          )
      )
    } else {
      const selectedData = getSelectedMediaDto(fileData)
      methods.setValue("selectedPages", [
        ...methods.getValues("selectedPages"),
        selectedData,
      ])
    }
  }

  useEffect(() => {
    methods.setValue("selectedPages", originalSelectedMedia)
  }, [methods, originalSelectedMedia])

  const onModalClose = () => {
    methods.reset()
    onClose()
  }

  const onSubmit = async (data: MediaFolderCreationInfo) => {
    await onProceed(data)
    methods.reset()
  }

  return (
    <Modal isOpen={isOpen} onClose={onModalClose} size="5xl">
      <ModalOverlay />
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <ModalContent my="4rem">
            <ModalCloseButton top="1.5rem" insetEnd="2rem" />

            <ModalHeader pt="2rem" pb={0} px="2rem">
              <Text as="h4" textStyle="h4" mr="2.5rem">
                Create a new {singularDirectoryLabel}
                {originalSelectedMedia.length > 0
                  ? ` with ${originalSelectedMedia.length} ${
                      originalSelectedMedia.length === 1
                        ? singularMediaLabel
                        : pluralMediaLabel
                    }`
                  : ""}
              </Text>
            </ModalHeader>

            <ModalBody px="2rem" pt="0.5rem" pb={0}>
              <FormControl
                isRequired
                isInvalid={!!methods.formState.errors.newDirectoryName}
                mt="1.5rem"
              >
                <FormLabel>
                  {_.upperFirst(singularDirectoryLabel)} name
                </FormLabel>
                <Input
                  type="text"
                  placeholder={`Give your ${singularDirectoryLabel} a name`}
                  {...methods.register("newDirectoryName", { required: true })}
                />
                <FormErrorMessage>
                  {methods.formState.errors.newDirectoryName?.message}
                </FormErrorMessage>
              </FormControl>

              {originalSelectedMedia.length === 0 && files.length !== 0 && (
                <>
                  <Text as="h5" textStyle="h5" mt="2rem">
                    Select {pluralMediaLabel} to add to this{" "}
                    {singularDirectoryLabel}
                  </Text>

                  <Text textStyle="body-1" my="0.5rem">
                    Click ‘Skip, I’ll add {pluralMediaLabel} later’ to create an
                    empty {singularDirectoryLabel}. You can add{" "}
                    {pluralMediaLabel} to the {singularDirectoryLabel} later.
                  </Text>

                  <Skeleton
                    px="2px"
                    py="1rem"
                    w="100%"
                    h={isListMediaFilesLoading ? "9rem" : "fit-content"}
                    isLoaded={!isListMediaFilesLoading}
                  >
                    {files.length > 0 && (
                      <Box w="100%" h="25.25rem" overflow="scroll" p="2px">
                        <SimpleGrid columns={3} spacing="1.5rem" w="100%">
                          {files.map(({ data }) => {
                            return data && mediaType === "images" ? (
                              <ImagePreviewCard
                                key={data.name}
                                name={data.name}
                                addedTime={data.addedTime}
                                mediaUrl={data.mediaUrl}
                                imageHeight="10.5rem"
                                isSelected={methods
                                  .watch("selectedPages")
                                  .some(
                                    (selectedData) =>
                                      selectedData.filePath === data.mediaPath
                                  )}
                                isMenuNeeded={false}
                                onClick={() => handleSelect(data)}
                                onCheck={() => handleSelect(data)}
                              />
                            ) : (
                              data && (
                                <FilePreviewCard
                                  name={data.name}
                                  isSelected={methods
                                    .watch("selectedPages")
                                    .some(
                                      (selectedData) =>
                                        selectedData.filePath === data.mediaPath
                                    )}
                                  isMenuNeeded={false}
                                  onClick={() => handleSelect(data)}
                                  onCheck={() => handleSelect(data)}
                                />
                              )
                            )
                          })}
                        </SimpleGrid>

                        {/* Pagination segment */}
                        {mediaFolderFiles?.total !== 0 && (
                          <Center mt="3rem">
                            <Pagination
                              totalCount={mediaFolderFiles?.total || 0}
                              pageSize={MEDIA_PAGINATION_SIZE}
                              currentPage={curPage}
                              onPageChange={(page) => setCurPage(page)}
                            />
                          </Center>
                        )}
                      </Box>
                    )}
                  </Skeleton>
                </>
              )}
            </ModalBody>

            <ModalFooter mt={0} px="2rem" pt="0.5rem" pb="1.5rem">
              <HStack
                w="100%"
                spacing={4}
                justifyContent="flex-end"
                mt="0.5rem"
              >
                {(originalSelectedMedia.length > 0 || files.length === 0) && (
                  <Button
                    variant="clear"
                    colorScheme="neutral"
                    onClick={onModalClose}
                  >
                    Cancel
                  </Button>
                )}
                {originalSelectedMedia.length === 0 && files.length !== 0 && (
                  <Button
                    variant="clear"
                    colorScheme="neutral"
                    isLoading={
                      isLoading && methods.watch("selectedPages").length === 0
                    }
                    isDisabled={isWriteDisabled}
                    onClick={methods.handleSubmit((data) => {
                      methods.setValue("selectedPages", [])
                      const dataWithoutSelectedPages = {
                        ...data,
                        selectedPages: [],
                      }
                      onSubmit(dataWithoutSelectedPages)
                    })}
                  >
                    Skip, I’ll add {pluralMediaLabel} later
                  </Button>
                )}
                <Button
                  type="submit"
                  colorScheme="main"
                  isLoading={
                    isLoading && methods.watch("selectedPages").length > 0
                  }
                  isDisabled={
                    isWriteDisabled ||
                    !methods.formState.isDirty ||
                    _.some(methods.formState.errors) ||
                    (originalSelectedMedia.length === 0 &&
                      files.length !== 0 &&
                      methods.watch("selectedPages").length === 0)
                  }
                >
                  {getButtonLabel(
                    originalSelectedMedia,
                    files.length,
                    methods.getValues("selectedPages"),
                    mediaLabels
                  )}
                </Button>
              </HStack>
            </ModalFooter>
          </ModalContent>
        </form>
      </FormProvider>
    </Modal>
  )
}
