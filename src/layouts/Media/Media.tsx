import {
  Box,
  Center,
  HStack,
  Icon,
  SimpleGrid,
  Skeleton,
  Spacer,
  Text,
  useDisclosure,
  VStack,
} from "@chakra-ui/react"
import {
  Badge,
  Button,
  Menu,
  Pagination,
  Tooltip,
} from "@opengovsg/design-system-react"
import _ from "lodash"
import { useEffect, useState } from "react"
import { BiFolderOpen, BiFolderPlus, BiTrash } from "react-icons/bi"
import { Link, Switch, useHistory, useRouteMatch } from "react-router-dom"

import { CreateMediaFolderModal } from "components/CreateMediaFolderModal"
import { DeleteMediaModal } from "components/DeleteMediaModal"
import { Greyscale } from "components/Greyscale"
import { ImagePreviewCard } from "components/ImagePreviewCard"
import { MoveMediaModal } from "components/MoveMediaModal"

import { LOCAL_STORAGE_KEYS } from "constants/localStorage"
import { MEDIA_PAGINATION_SIZE, MAX_MEDIA_LEVELS } from "constants/media"

import { useCreateDirectoryAndMoveFilesHook } from "hooks/directoryHooks/useCreateDirectoryAndMoveFilesHook"
import { useGetAllMediaFiles } from "hooks/directoryHooks/useGetAllMediaFiles"
import { useListMediaFolderFiles } from "hooks/directoryHooks/useListMediaFolderFiles"
import { useListMediaFolderSubdirectories } from "hooks/directoryHooks/useListMediaFolderSubdirectories"
import { useDeleteMultipleMediaHook } from "hooks/mediaHooks"
import { useMoveMultipleMediaHook } from "hooks/moveHooks"
import { usePaginate } from "hooks/usePaginate"
import useRedirectHook from "hooks/useRedirectHook"

import { DeleteWarningScreen } from "layouts/screens/DeleteWarningScreen"
import { DirectorySettingsScreen } from "layouts/screens/DirectorySettingsScreen"
import { MediaCreationScreen } from "layouts/screens/MediaCreationScreen"
import { MediaSettingsScreen } from "layouts/screens/MediaSettingsScreen"

import { ProtectedRouteWithProps } from "routing/ProtectedRouteWithProps"

import { getMediaLabels, getSelectedMediaDto } from "utils/media"
import { isWriteActionsDisabled } from "utils/reviewRequests"

import { EmptyAlbumImage, EmptyDirectoryImage } from "assets"
import { FeatureTourHandler } from "features/FeatureTour/FeatureTour"
import {
  MEDIA_FEATURE_STEPS,
  MEDIA_ONSELECT_FEATURE_STEPS,
} from "features/FeatureTour/FeatureTourSequence"
import { MediaData } from "types/directory"
import { MediaFolderTypes, MediaLabels, SelectedMediaDto } from "types/media"
import {
  ALLOWED_CHARACTERS_REGEX,
  DEFAULT_RETRY_MSG,
  specialCharactersRegexTest,
  useErrorToast,
  useSuccessToast,
} from "utils"

import { CreateButton } from "../components"
import { SiteEditLayout } from "../layouts"

import {
  FilePreviewCard,
  MediaBreadcrumbs,
  MediaDirectoryCard,
} from "./components"

interface CreateDirectoryButtonProps {
  isWriteDisabled: boolean | undefined
  directoryLevel: number
  singularDirectoryLabel: string
  onOpen: () => void
}

// Utility method for getting the text under the page title in the header
const getSubheadText = (
  subDirCount: number,
  filesCount: number,
  mediaLabels: MediaLabels,
  isUngrouped: boolean
) => {
  const results = []
  if (subDirCount > 0) {
    results.push(
      `${subDirCount} ${
        subDirCount === 1
          ? mediaLabels.singularDirectoryLabel
          : mediaLabels.pluralDirectoryLabel
      }`
    )
  }

  results.push(
    `${filesCount} ${isUngrouped && filesCount > 0 ? "ungrouped " : ""}${
      filesCount === 1
        ? mediaLabels.singularMediaLabel
        : mediaLabels.pluralMediaLabel
    }`
  )

  return results.join(" and ")
}

// Utility method for getting the text to display in the empty state (i.e. when
// there are no files and folders to display
const getPlaceholderText = (
  directoryLevel: number,
  { pluralDirectoryLabel, pluralMediaLabel }: MediaLabels
) => {
  const results = []
  results.push(_.upperFirst(pluralMediaLabel))

  if (directoryLevel < MAX_MEDIA_LEVELS) {
    results.push(`and ${pluralDirectoryLabel}`)
  }

  results.push("you add will appear here.")

  return results.join(" ")
}

const CreateDirectoryButton = ({
  isWriteDisabled,
  directoryLevel,
  singularDirectoryLabel,
  onOpen,
}: CreateDirectoryButtonProps) => (
  <Greyscale isActive={isWriteDisabled}>
    <CreateButton
      onClick={onOpen}
      isDisabled={directoryLevel >= MAX_MEDIA_LEVELS}
    >
      {`Create ${singularDirectoryLabel}`}
    </CreateButton>
  </Greyscale>
)

export const Media = (): JSX.Element => {
  const history = useHistory()
  const [curPage, setCurPage] = usePaginate()
  const { params, path, url } = useRouteMatch<{
    siteName: string
    mediaRoom: MediaFolderTypes
    mediaDirectoryName: string
  }>()
  const { setRedirectToPage } = useRedirectHook()
  const { siteName, mediaRoom: mediaType, mediaDirectoryName } = params
  const [selectedMedia, setSelectedMedia] = useState<SelectedMediaDto[]>([])
  // Note: We need a separate variable here so that we do not lose the selection
  // that the user might already have. If the user modifies this individual file
  // and it was originally selected, we will remove it from selectedMedia.
  const [
    individualMedia,
    setIndividualMedia,
  ] = useState<SelectedMediaDto | null>(null)

  const {
    isOpen: isCreateMediaFolderModalOpen,
    onOpen: onCreateMediaFolderModalOpen,
    onClose: onCreateMediaFolderModalClose,
  } = useDisclosure()

  const {
    isOpen: isMoveModalOpen,
    onOpen: onMoveModalOpen,
    onClose: onMoveModalClose,
  } = useDisclosure()
  const {
    isOpen: isDeleteModalOpen,
    onOpen: onDeleteModalOpen,
    onClose: onDeleteModalClose,
  } = useDisclosure()

  const {
    articleLabel,
    singularMediaLabel,
    pluralMediaLabel,
    singularDirectoryLabel,
    pluralDirectoryLabel,
  } = getMediaLabels(mediaType)

  const successToast = useSuccessToast()
  const errorToast = useErrorToast()

  const handleSelect = (fileData: MediaData) => {
    if (
      selectedMedia.some(
        (selectedData) => selectedData.filePath === fileData.mediaPath
      )
    ) {
      setSelectedMedia(
        selectedMedia.filter(
          (selectedData) => selectedData.filePath !== fileData.mediaPath
        )
      )
    } else {
      const selectedData = getSelectedMediaDto(fileData)
      setSelectedMedia([...selectedMedia, selectedData])
    }
  }

  useEffect(() => {
    // NOTE: Because this component is shared between different media types + subfolders,
    // we need to reset the page number to 1 when the url changes.
    // If this is not done, we might end up with erroneous pagination
    // such as being on page 4 of a 1 page list.
    // This results in the back button being clickable,
    // but the number always being 1.
    setCurPage(1)
    // NOTE: **NOT** adding `setCurPage` as a dependency here
    // as it will return a different function reference on every render
    // and cause the effect to run again
    // resulting in it going from page 1 -> page n -> page 1
    // when we click on the pagination.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url])

  useEffect(() => {
    // Note: This component is shared between different media types. Hence, we
    // need to reset the selected media when the media type changes. Otherwise,
    // the user will still see the selected media from the previous media type.
    setSelectedMedia([])
    setIndividualMedia(null)
  }, [mediaType])

  const {
    data: mediaFolderSubdirectories,
    isLoading: isListMediaFolderSubdirectoriesLoading,
  } = useListMediaFolderSubdirectories({
    ...params,
  })

  const {
    data: mediaFolderFiles,
    isLoading: isListMediaFilesLoading,
  } = useListMediaFolderFiles({
    ...params,
    // NOTE: Subtracting 1 here because `usePaginate`
    // returns an index with 1 offset
    curPage: curPage - 1,
    limit: MEDIA_PAGINATION_SIZE,
  })

  const files = useGetAllMediaFiles(
    mediaFolderFiles?.files || [],
    params.siteName,
    params.mediaDirectoryName
  )

  const {
    mutateAsync: createDirectoryAndMoveFiles,
    isLoading: isCreateDirectoryAndMoveFilesLoading,
  } = useCreateDirectoryAndMoveFilesHook(params, {
    onSettled: () => {
      setSelectedMedia([])
      onCreateMediaFolderModalClose()
    },
    onSuccess: (data, variables) => {
      if (variables.selectedPages.length === 0) {
        successToast({
          id: "create-directory-success",
          description: `Successfully created ${singularDirectoryLabel}!`,
        })
      } else {
        successToast({
          id: "create-directory-and-move-files-success",
          description: `Successfully created ${singularDirectoryLabel} and moved ${
            variables.selectedPages.length === 1
              ? singularMediaLabel
              : pluralMediaLabel
          }!`,
        })
      }

      setRedirectToPage(
        `${url}%2F${encodeURIComponent(variables.newDirectoryName)}`
      )
    },
    onError: () => {
      errorToast({
        id: "create-directory-error",
        description: `Your ${singularDirectoryLabel} could not be created successfully. ${DEFAULT_RETRY_MSG}`,
      })
    },
  })

  const {
    mutate: moveMultipleMedia,
    isLoading: isMoveMultipleMediaLoading,
  } = useMoveMultipleMediaHook(params, {
    onSettled: () => {
      setSelectedMedia([])
      onMoveModalClose()
    },
    onSuccess: (data, variables) => {
      successToast({
        id: "move-multiple-media-success",
        description: `Successfully moved ${
          variables.items.length === 1 ? singularMediaLabel : pluralMediaLabel
        }!`,
      })
    },
    onError: (err, variables) => {
      errorToast({
        id: "move-multiple-media-error",
        description: `Your ${
          variables.items.length === 1 ? singularMediaLabel : pluralMediaLabel
        } could not be moved successfully. ${DEFAULT_RETRY_MSG}`,
      })
    },
  })

  const {
    mutate: deleteMultipleMedia,
    isLoading: isDeleteMultipleMediaLoading,
  } = useDeleteMultipleMediaHook(params, {
    onSettled: (data, error, variables) => {
      if (variables.length === 1) {
        setSelectedMedia(
          selectedMedia.filter((selectedData) =>
            variables.some(
              (variable) => variable.filePath !== selectedData.filePath
            )
          )
        )
      } else {
        setSelectedMedia([])
      }
      if (individualMedia) setIndividualMedia(null)
      onDeleteModalClose()
    },
    onSuccess: (data, variables) => {
      successToast({
        id: "delete-multiple-media-success",
        description: `Successfully deleted ${
          variables.length === 1 ? singularMediaLabel : pluralMediaLabel
        }!`,
      })
    },
    onError: (err, variables) => {
      errorToast({
        id: "delete-multiple-media-error",
        description: `Your ${
          variables.length === 1 ? singularMediaLabel : pluralMediaLabel
        } could not be deleted successfully. ${DEFAULT_RETRY_MSG}`,
      })
    },
  })

  const isWriteDisabled = isWriteActionsDisabled(siteName)
  const subDirCount = mediaFolderSubdirectories?.directories?.length || 0
  const filesCount = mediaFolderFiles?.total || 0
  const directoryLevel = mediaDirectoryName.split("%2F").length
  const isUngrouped = !mediaDirectoryName.includes("%2F")

  return (
    <>
      <CreateMediaFolderModal
        originalSelectedMedia={selectedMedia}
        mediaLabels={getMediaLabels(mediaType)}
        mediaType={mediaType}
        subDirectories={mediaFolderSubdirectories}
        mediaDirectoryName={mediaDirectoryName}
        isOpen={isCreateMediaFolderModalOpen}
        isLoading={isCreateDirectoryAndMoveFilesLoading}
        onClose={onCreateMediaFolderModalClose}
        onProceed={createDirectoryAndMoveFiles}
      />

      <MoveMediaModal
        selectedMedia={(individualMedia && [individualMedia]) || selectedMedia}
        mediaType={mediaType}
        mediaLabels={getMediaLabels(mediaType)}
        isWriteDisabled={isWriteDisabled}
        isOpen={isMoveModalOpen}
        isLoading={isMoveMultipleMediaLoading}
        onClose={() => {
          setIndividualMedia(null)
          onMoveModalClose()
        }}
        onProceed={moveMultipleMedia}
      />

      <DeleteMediaModal
        selectedMedia={(individualMedia && [individualMedia]) || selectedMedia}
        mediaLabels={getMediaLabels(mediaType)}
        isWriteDisabled={isWriteDisabled}
        isOpen={isDeleteModalOpen}
        isLoading={isDeleteMultipleMediaLoading}
        onClose={() => {
          setIndividualMedia(null)
          onDeleteModalClose()
        }}
        onProceed={() => {
          deleteMultipleMedia(
            (individualMedia && [individualMedia]) || selectedMedia
          )
        }}
      />
      {(subDirCount !== 0 || filesCount !== 0) &&
        selectedMedia.length === 0 && (
          <FeatureTourHandler
            localStorageKey={LOCAL_STORAGE_KEYS.MediaFeatureTour}
            steps={MEDIA_FEATURE_STEPS}
          />
        )}

      {(subDirCount !== 0 || filesCount !== 0) &&
        selectedMedia.length !== 0 && (
          <FeatureTourHandler
            localStorageKey={LOCAL_STORAGE_KEYS.MediaOnSelectFeatureTour}
            steps={MEDIA_ONSELECT_FEATURE_STEPS}
          />
        )}

      <SiteEditLayout overflow="hidden">
        <VStack spacing={0} w="100%">
          {/* Header section */}
          <HStack w="100%">
            {/* Page title segment */}
            <VStack spacing="0.5rem" align="left" w="40%">
              <MediaBreadcrumbs />
              <Text as="h4" textStyle="h4" mt="0.75rem">
                {mediaType === mediaDirectoryName
                  ? `All ${mediaType}`
                  : _.upperFirst(mediaDirectoryName.split("%2F").pop())}
              </Text>
              <Text textStyle="subhead-2" color="base.content.medium">
                {getSubheadText(
                  subDirCount,
                  filesCount,
                  getMediaLabels(mediaType),
                  isUngrouped
                )}
              </Text>
            </VStack>

            {/* Action buttons segment */}
            {selectedMedia.length > 0 && (
              <>
                <Spacer />

                <Box mt="auto">
                  <Button
                    variant="clear"
                    color="base.content.strong"
                    onClick={() => setSelectedMedia([])}
                  >
                    Deselect all
                  </Button>
                </Box>
                <Box
                  mt="auto"
                  id={MEDIA_ONSELECT_FEATURE_STEPS[0].target
                    .toString()
                    .replace("#", "")}
                >
                  <Menu
                    isStretch={false}
                    onOpen={() => setIndividualMedia(null)}
                    placement="bottom-end"
                  >
                    <Menu.Button
                      variant="clear"
                      colorScheme="slate"
                      // This prop is necessary as we are not able to set
                      // the colors inside the button, it is far too deep
                      sx={{
                        color: "base.content.strong",
                        _hover: {
                          backgroundColor: "interaction.tinted.main.hover",
                        },
                        _active: {
                          backgroundColor: "interaction.tinted.main.active",
                        },
                      }}
                    >
                      Edit selected
                      <Badge
                        borderRadius="3.125rem"
                        bgColor="interaction.sub-subtle.default"
                        color="interaction.sub.default"
                        ml="0.5rem"
                      >
                        {selectedMedia.length}
                      </Badge>
                    </Menu.Button>
                    <Menu.List>
                      <Menu.Item onClick={() => onMoveModalOpen()}>
                        <Icon as={BiFolderOpen} mr="1rem" fontSize="1.25rem" />
                        Move{" "}
                        {selectedMedia.length === 1
                          ? singularMediaLabel
                          : pluralMediaLabel}{" "}
                        to {singularDirectoryLabel}
                      </Menu.Item>

                      {directoryLevel < MAX_MEDIA_LEVELS && (
                        <Menu.Item
                          onClick={() => onCreateMediaFolderModalOpen()}
                        >
                          <Icon
                            as={BiFolderPlus}
                            mr="1rem"
                            fontSize="1.25rem"
                          />
                          Create new {singularDirectoryLabel} with{" "}
                          {selectedMedia.length === 1
                            ? singularMediaLabel
                            : pluralMediaLabel}
                        </Menu.Item>
                      )}

                      <Menu.Item
                        color="interaction.critical.default"
                        onClick={() => onDeleteModalOpen()}
                      >
                        <Icon as={BiTrash} mr="1rem" fontSize="1.25rem" />
                        Delete all
                      </Menu.Item>
                    </Menu.List>
                  </Menu>
                </Box>
              </>
            )}

            {(subDirCount !== 0 || filesCount !== 0) &&
              selectedMedia.length === 0 && (
                <>
                  <Spacer />

                  <Box mt="auto">
                    {directoryLevel >= MAX_MEDIA_LEVELS ? (
                      <Tooltip
                        label={`You can only add up to ${MAX_MEDIA_LEVELS} levels of ${pluralDirectoryLabel}`}
                        hasArrow
                        gutter={16}
                      >
                        <CreateDirectoryButton
                          isWriteDisabled={isWriteDisabled}
                          directoryLevel={directoryLevel}
                          singularDirectoryLabel={singularDirectoryLabel}
                          onOpen={onCreateMediaFolderModalOpen}
                        />
                      </Tooltip>
                    ) : (
                      <CreateDirectoryButton
                        isWriteDisabled={isWriteDisabled}
                        directoryLevel={directoryLevel}
                        singularDirectoryLabel={singularDirectoryLabel}
                        onOpen={onCreateMediaFolderModalOpen}
                      />
                    )}
                  </Box>
                  <Box
                    mt="auto"
                    id={MEDIA_FEATURE_STEPS[0].target
                      .toString()
                      .replace("#", "")}
                  >
                    <Greyscale isActive={isWriteDisabled}>
                      <Button as={Link} to={`${url}/createMedia`}>
                        {`Upload ${pluralMediaLabel}`}
                      </Button>
                    </Greyscale>
                  </Box>
                </>
              )}
          </HStack>

          {/* Subdirectories section */}
          {(isListMediaFolderSubdirectoriesLoading ||
            (mediaFolderSubdirectories?.directories?.length &&
              mediaFolderSubdirectories?.directories.length > 0)) && (
            <Skeleton
              w="100%"
              h={
                isListMediaFolderSubdirectoriesLoading
                  ? "4.5rem"
                  : "fit-content"
              }
              isLoaded={!isListMediaFolderSubdirectoriesLoading}
              mt="2rem"
            >
              <SimpleGrid w="100%" columns={3} spacing="1.5rem">
                {mediaFolderSubdirectories?.directories.map(({ name }) => {
                  return <MediaDirectoryCard title={name} />
                })}
              </SimpleGrid>
            </Skeleton>
          )}

          {/* Media section */}
          <Skeleton
            w="100%"
            h={isListMediaFilesLoading ? "4.5rem" : "fit-content"}
            isLoaded={!isListMediaFilesLoading}
            mt={
              mediaFolderSubdirectories?.directories?.length &&
              mediaFolderSubdirectories?.directories.length > 0
                ? "2.25rem"
                : "2rem"
            }
          >
            {subDirCount === 0 && filesCount === 0 ? (
              <Center mt="5.75rem">
                <VStack spacing={0}>
                  {mediaType === "images" && (
                    <EmptyAlbumImage width="16.25rem" />
                  )}
                  {mediaType === "files" && (
                    <EmptyDirectoryImage width="11.875rem" />
                  )}
                  <Text textStyle="subhead-1" mt="2.25rem">
                    {getPlaceholderText(
                      directoryLevel,
                      getMediaLabels(mediaType)
                    )}
                  </Text>
                  <Text textStyle="body-2" mt="0.25rem">
                    Upload {pluralMediaLabel} to link them on your pages.
                  </Text>
                  <Greyscale isActive={isWriteDisabled}>
                    <Button as={Link} to={`${url}/createMedia`} mt="2rem">
                      {`Upload ${pluralMediaLabel}`}
                    </Button>
                  </Greyscale>
                  {directoryLevel < MAX_MEDIA_LEVELS && (
                    <Greyscale isActive={isWriteDisabled}>
                      <Button
                        onClick={onCreateMediaFolderModalOpen}
                        mt="1rem"
                        variant="clear"
                      >
                        {`Or, create ${articleLabel} ${singularDirectoryLabel}`}
                      </Button>
                    </Greyscale>
                  )}
                </VStack>
              </Center>
            ) : (
              <>
                <SimpleGrid
                  columns={3}
                  spacing="1.5rem"
                  w="100%"
                  id={MEDIA_FEATURE_STEPS[1].target.toString().replace("#", "")}
                >
                  {files.map(({ data, isLoading }) => {
                    return (
                      // NOTE: Inner skeleton here is to allow for progressive load.
                      // We show each individual card in a loading state and
                      // allow them to fill in when possible.
                      <Skeleton
                        w="100%"
                        h={isLoading ? "4.5rem" : "fit-content"}
                        isLoaded={!isLoading}
                      >
                        {data && mediaType === "images" ? (
                          <ImagePreviewCard
                            name={data.name}
                            addedTime={data.addedTime}
                            mediaUrl={data.mediaUrl}
                            isSelected={selectedMedia.some(
                              (selectedData) =>
                                selectedData.filePath === data.mediaPath
                            )}
                            onOpen={() =>
                              setIndividualMedia(getSelectedMediaDto(data))
                            }
                            onCheck={() => handleSelect(data)}
                            onDelete={onDeleteModalOpen}
                            onMove={onMoveModalOpen}
                          />
                        ) : (
                          data && (
                            <FilePreviewCard
                              name={data.name}
                              isSelected={selectedMedia.some(
                                (selectedData) =>
                                  selectedData.filePath === data.mediaPath
                              )}
                              onOpen={() =>
                                setIndividualMedia(getSelectedMediaDto(data))
                              }
                              onCheck={() => handleSelect(data)}
                              onDelete={onDeleteModalOpen}
                              onMove={onMoveModalOpen}
                            />
                          )
                        )}
                      </Skeleton>
                    )
                  })}
                </SimpleGrid>

                {/* Pagination segment */}
                {filesCount !== 0 && (
                  <Center mt="3rem">
                    <Pagination
                      totalCount={mediaFolderFiles?.total || 0}
                      pageSize={MEDIA_PAGINATION_SIZE}
                      currentPage={curPage}
                      onPageChange={(page) => setCurPage(page)}
                    />
                  </Center>
                )}
              </>
            )}
          </Skeleton>
        </VStack>
      </SiteEditLayout>
      <Switch>
        <ProtectedRouteWithProps
          path={[`${path}/createMedia`]}
          component={MediaCreationScreen}
          onClose={() => history.goBack()}
        />
        <ProtectedRouteWithProps
          path={[`${path}/editMediaSettings/:fileName`]}
          component={MediaSettingsScreen}
          onClose={() => history.goBack()}
          validate={{
            fileName: (value) => {
              const encodedName = value.split(".").slice(0, -1).join(".")
              const decodedName = decodeURIComponent(encodedName)
              return ALLOWED_CHARACTERS_REGEX.test(decodedName)
            },
          }}
        />
        <ProtectedRouteWithProps
          path={[`${path}/deleteDirectory/:mediaDirectoryName`]}
          component={DeleteWarningScreen}
          onClose={() => history.goBack()}
          validate={{
            mediaDirectoryName: (value) => {
              // NOTE: This value is prepended with either `files|images`
              // and nested directories are separated by `/` as well.
              const decodedValues = decodeURIComponent(value).split("/")
              return decodedValues.every((val) =>
                ALLOWED_CHARACTERS_REGEX.test(val)
              )
            },
          }}
        />
        <ProtectedRouteWithProps
          path={[`${path}/editDirectorySettings/:mediaDirectoryName`]}
          component={DirectorySettingsScreen}
          onClose={() => history.goBack()}
          validate={{
            mediaDirectoryName: (value) => {
              // NOTE: This value is prepended with either `files|images`
              // and nested directories are separated by `/` as well.
              const decodedValues = decodeURIComponent(value).split("/")
              return decodedValues.every((val) =>
                ALLOWED_CHARACTERS_REGEX.test(val)
              )
            },
          }}
        />
      </Switch>
    </>
  )
}
