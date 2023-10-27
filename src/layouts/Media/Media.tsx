import {
  Box,
  Center,
  HStack,
  Icon,
  SimpleGrid,
  Skeleton,
  Spacer,
  Text,
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

import { Greyscale } from "components/Greyscale"
import { ImagePreviewCard } from "components/ImagePreviewCard"

import { MEDIA_PAGINATION_SIZE, MAX_MEDIA_LEVELS } from "constants/media"

import { useGetAllMediaFiles } from "hooks/directoryHooks/useGetAllMediaFiles"
import { useListMediaFolderFiles } from "hooks/directoryHooks/useListMediaFolderFiles"
import { useListMediaFolderSubdirectories } from "hooks/directoryHooks/useListMediaFolderSubdirectories"
import { usePaginate } from "hooks/usePaginate"

import { DeleteWarningScreen } from "layouts/screens/DeleteWarningScreen"
import { DirectoryCreationScreen } from "layouts/screens/DirectoryCreationScreen"
import { DirectorySettingsScreen } from "layouts/screens/DirectorySettingsScreen"
import { MediaCreationScreen } from "layouts/screens/MediaCreationScreen"
import { MediaSettingsScreen } from "layouts/screens/MediaSettingsScreen"
import { MoveScreen } from "layouts/screens/MoveScreen"

import { ProtectedRouteWithProps } from "routing/ProtectedRouteWithProps"

import { isWriteActionsDisabled } from "utils/reviewRequests"

import { EmptyAlbumImage } from "assets"

import { CreateButton } from "../components"
import { SiteEditLayout } from "../layouts"

import {
  // ImagePreviewCard,
  FilePreviewCard,
  MediaBreadcrumbs,
  MediaDirectoryCard,
} from "./components"

interface MediaLabels {
  articleLabel: "a" | "an"
  singularMediaLabel: "file" | "image"
  pluralMediaLabel: "files" | "images"
  singularDirectoryLabel: "directory" | "album"
  pluralDirectoryLabel: "directories" | "albums"
}

// Utility method to help ease over the various labels associated
// with the media type so that we can avoid repeated conditionals
const getMediaLabels = (mediaType: "files" | "images"): MediaLabels => {
  if (mediaType === "files") {
    return {
      articleLabel: "a",
      singularMediaLabel: "file",
      pluralMediaLabel: "files",
      singularDirectoryLabel: "directory",
      pluralDirectoryLabel: "directories",
    }
  }

  return {
    articleLabel: "an",
    singularMediaLabel: "image",
    pluralMediaLabel: "images",
    singularDirectoryLabel: "album",
    pluralDirectoryLabel: "albums",
  }
}

const getSubheadText = (
  countSubdirectories: number,
  countFiles: number,
  mediaLabels: MediaLabels,
  isUngrouped: boolean
) => {
  const results = []
  if (countSubdirectories > 0) {
    results.push(
      `${countSubdirectories} ${
        countSubdirectories === 1
          ? mediaLabels.singularDirectoryLabel
          : mediaLabels.pluralDirectoryLabel
      }`
    )
  }

  results.push(
    `${countFiles} ${isUngrouped ? "ungrouped " : ""}${
      countFiles === 1
        ? mediaLabels.singularMediaLabel
        : mediaLabels.pluralMediaLabel
    }`
  )

  return results.join(" and ")
}

export const Media = (): JSX.Element => {
  const CreateAlbumButton = () => (
    <Greyscale isActive={isWriteDisabled}>
      <CreateButton
        as={Link}
        to={
          mediaDirectoryName.split("%2F").length < MAX_MEDIA_LEVELS
            ? `${url}/createDirectory`
            : "#"
        }
        isDisabled={mediaDirectoryName.split("%2F").length >= MAX_MEDIA_LEVELS}
      >
        {`Create ${singularDirectoryLabel}`}
      </CreateButton>
    </Greyscale>
  )

  const handleSelect = (filePath: string) => {
    if (selectedImages.includes(filePath)) {
      setSelectedImages(selectedImages.filter((img) => img !== filePath))
    } else {
      setSelectedImages([...selectedImages, filePath])
    }
  }

  const history = useHistory()
  const [curPage, setCurPage] = usePaginate()
  const { params, path, url } = useRouteMatch<{
    siteName: string
    mediaRoom: "files" | "images"
    mediaDirectoryName: string
  }>()
  const { siteName, mediaRoom: mediaType, mediaDirectoryName } = params
  const [selectedImages, setSelectedImages] = useState<string[]>([])

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
    articleLabel,
    pluralMediaLabel,
    singularDirectoryLabel,
    pluralDirectoryLabel,
  } = getMediaLabels(mediaType)

  const isWriteDisabled = isWriteActionsDisabled(siteName)
  const countSubdirectories =
    mediaFolderSubdirectories?.directories?.length || 0
  const countFiles = mediaFolderFiles?.total || 0
  const isUngrouped = !mediaDirectoryName.includes("%2F")

  return (
    <>
      <SiteEditLayout overflow="hidden">
        <VStack spacing="2rem" w="100%">
          {/* Header section */}
          <HStack w="100%">
            <VStack spacing="0.5rem" align="left" w="40%">
              <MediaBreadcrumbs />
              <Text as="h4" textStyle="h4">
                All {mediaType}
              </Text>
              <Text textStyle="subhead-2" mt="0.25rem">
                {getSubheadText(
                  countSubdirectories,
                  countFiles,
                  getMediaLabels(mediaType),
                  isUngrouped
                )}
              </Text>
            </VStack>
            {files &&
              mediaFolderFiles &&
              (countSubdirectories !== 0 ||
                countFiles !== 0 ||
                selectedImages.length > 0) && (
                <>
                  <Spacer />
                  {selectedImages.length > 0 ? (
                    <>
                      <Box mt="auto">
                        <Button
                          variant="clear"
                          color="base.content.strong"
                          onClick={() => setSelectedImages([])}
                        >
                          Deselect all
                        </Button>
                      </Box>
                      <Box mt="auto">
                        <Menu isStretch={false}>
                          <Menu.Button
                            variant="clear"
                            colorScheme="slate"
                            sx={{
                              color: "base.content.strong",
                              _hover: {
                                backgroundColor:
                                  "interaction.tinted.main.hover",
                              },
                              _active: {
                                backgroundColor:
                                  "interaction.tinted.main.active",
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
                              {selectedImages.length}
                            </Badge>
                          </Menu.Button>
                          <Menu.List>
                            <Menu.Item>
                              <Icon
                                as={BiFolderOpen}
                                mr="1rem"
                                fontSize="1.25rem"
                              />
                              Move images to album
                            </Menu.Item>
                            <Menu.Item>
                              <Icon
                                as={BiFolderPlus}
                                mr="1rem"
                                fontSize="1.25rem"
                              />
                              Create new album with images
                            </Menu.Item>
                            <Menu.Item color="interaction.critical.default">
                              <Icon as={BiTrash} mr="1rem" fontSize="1.25rem" />
                              Delete all
                            </Menu.Item>
                          </Menu.List>
                        </Menu>
                      </Box>
                    </>
                  ) : (
                    <>
                      <Box mt="auto">
                        {mediaDirectoryName.split("%2F").length >=
                        MAX_MEDIA_LEVELS ? (
                          <Tooltip
                            label={`You can only add up to ${MAX_MEDIA_LEVELS} levels of ${pluralMediaLabel}`}
                            hasArrow
                            gutter={16}
                          >
                            <CreateAlbumButton />
                          </Tooltip>
                        ) : (
                          <CreateAlbumButton />
                        )}
                      </Box>
                      <Box mt="auto">
                        <Greyscale isActive={isWriteDisabled}>
                          <Button as={Link} to={`${url}/createMedia`}>
                            {`Upload ${pluralMediaLabel}`}
                          </Button>
                        </Greyscale>
                      </Box>
                    </>
                  )}
                </>
              )}
          </HStack>

          {/* Subdirectories section */}
          <Skeleton
            w="100%"
            h={
              isListMediaFolderSubdirectoriesLoading ? "4.5rem" : "fit-content"
            }
            isLoaded={!isListMediaFolderSubdirectoriesLoading}
          >
            <SimpleGrid w="100%" columns={3} spacing="1.5rem">
              {mediaFolderSubdirectories?.directories.map(({ name }) => {
                return <MediaDirectoryCard title={name} />
              })}
            </SimpleGrid>
          </Skeleton>

          {/* Media section */}
          <Skeleton
            w="100%"
            h={isListMediaFilesLoading ? "4.5rem" : "fit-content"}
            isLoaded={!isListMediaFilesLoading}
            mt="0.25rem"
          >
            {files &&
            mediaFolderFiles &&
            countSubdirectories === 0 &&
            countFiles === 0 ? (
              <Center mt="5.75rem">
                <VStack spacing={0}>
                  <EmptyAlbumImage width="16.25rem" />
                  <Text textStyle="subhead-1" mt="2.25rem">
                    {_.upperFirst(pluralMediaLabel)}{" "}
                    {mediaDirectoryName.split("%2F").length <
                      MAX_MEDIA_LEVELS && ` and ${pluralDirectoryLabel}`}{" "}
                    you add will appear here.
                  </Text>
                  <Text textStyle="body-2" mt="0.25rem">
                    Upload {pluralMediaLabel} to link them on your pages.
                  </Text>
                  <Greyscale isActive={isWriteDisabled}>
                    <Button as={Link} to={`${url}/createMedia`} mt="2rem">
                      {`Upload ${pluralMediaLabel}`}
                    </Button>
                  </Greyscale>
                  {mediaDirectoryName.split("%2F").length <
                    MAX_MEDIA_LEVELS && (
                    <Greyscale isActive={isWriteDisabled}>
                      <Button
                        as={Link}
                        to={`${url}/createDirectory`}
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
                <SimpleGrid columns={3} spacing="1.5rem" w="100%">
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
                            isSelected={selectedImages.includes(data.mediaPath)}
                            onCheck={() => handleSelect(data.mediaPath)}
                          />
                        ) : (
                          data && <FilePreviewCard name={data.name} />
                        )}
                      </Skeleton>
                    )
                  })}
                </SimpleGrid>
                {files && mediaFolderFiles && countFiles !== 0 && (
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
        />
        <ProtectedRouteWithProps
          path={[`${path}/createDirectory`]}
          component={DirectoryCreationScreen}
          onClose={() => history.goBack()}
        />
        <ProtectedRouteWithProps
          path={[
            `${path}/deleteMedia/:fileName`,
            `${path}/deleteDirectory/:mediaDirectoryName`,
          ]}
          component={DeleteWarningScreen}
          onClose={() => history.goBack()}
        />
        <ProtectedRouteWithProps
          path={[`${path}/editDirectorySettings/:mediaDirectoryName`]}
          component={DirectorySettingsScreen}
          onClose={() => history.goBack()}
        />
        <ProtectedRouteWithProps
          path={[`${path}/moveMedia/:fileName`]}
          component={MoveScreen}
          onClose={() => history.goBack()}
        />
      </Switch>
    </>
  )
}
