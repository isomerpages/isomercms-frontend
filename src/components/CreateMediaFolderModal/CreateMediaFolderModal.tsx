import {
  Box,
  FormControl,
  HStack,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  SimpleGrid,
  Text,
} from "@chakra-ui/react"
import { yupResolver } from "@hookform/resolvers/yup"
import {
  Button,
  FormErrorMessage,
  FormLabel,
  Input,
  ModalCloseButton,
} from "@opengovsg/design-system-react"
import { AxiosError } from "axios"
import _ from "lodash"
import { useEffect } from "react"
import { FormProvider, useForm } from "react-hook-form"
import { UseMutateAsyncFunction } from "react-query"

import { DirectorySettingsSchema } from "components/DirectorySettingsModal"
import { ImagePreviewCard } from "components/ImagePreviewCard"

import { FilePreviewCard } from "layouts/Media/components"

import { getSelectedMediaDto } from "utils/media"

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
  mediaData: (MediaData | undefined)[]
  isWriteDisabled: boolean | undefined
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
  selectedMedia: SelectedMediaDto[],
  mediaLabels: MediaLabels
) => {
  const {
    singularDirectoryLabel,
    singularMediaLabel,
    pluralMediaLabel,
  } = mediaLabels

  if (originalSelectedMedia.length > 0) {
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
  mediaData,
  isWriteDisabled,
  isOpen,
  isLoading,
  onClose,
  onProceed,
}: CreateMediaFolderModalProps): JSX.Element => {
  const {
    singularMediaLabel,
    pluralMediaLabel,
    singularDirectoryLabel,
  } = mediaLabels

  const existingTitles = subDirectories?.directories.map(
    (directory) => directory.name
  )

  const methods = useForm<MediaFolderCreationInfo>({
    mode: "onChange",
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
  }, [originalSelectedMedia])

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

              {originalSelectedMedia.length === 0 && (
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

                  {mediaData.length > 0 && (
                    <Box
                      w="100%"
                      h="25.25rem"
                      overflow="scroll"
                      px="2px"
                      py="1rem"
                    >
                      <SimpleGrid columns={3} spacing="1.5rem" w="100%">
                        {mediaData.map((data) =>
                          data && mediaType === "images" ? (
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
                        )}
                      </SimpleGrid>
                    </Box>
                  )}
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
                {originalSelectedMedia.length > 0 && (
                  <Button
                    variant="clear"
                    colorScheme="neutral"
                    onClick={onModalClose}
                  >
                    Cancel
                  </Button>
                )}
                {originalSelectedMedia.length === 0 && (
                  <Button
                    variant="clear"
                    colorScheme="neutral"
                    isLoading={
                      isLoading && methods.watch("selectedPages").length === 0
                    }
                    isDisabled={isWriteDisabled}
                    onClick={methods.handleSubmit((data) => {
                      methods.setValue("selectedPages", [])
                      onSubmit(data)
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
                      methods.watch("selectedPages").length === 0)
                  }
                >
                  {getButtonLabel(
                    originalSelectedMedia,
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
