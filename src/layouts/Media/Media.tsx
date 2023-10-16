import { SimpleGrid, Box, Text, Skeleton, Center } from "@chakra-ui/react"
import { Button, Pagination } from "@opengovsg/design-system-react"
import _ from "lodash"
import { useEffect } from "react"
import { BiBulb, BiUpload } from "react-icons/bi"
import { Link, Switch, useRouteMatch, useHistory } from "react-router-dom"

import { Greyscale } from "components/Greyscale"

import { MEDIA_PAGINATION_SIZE } from "constants/pagination"

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

import {
  CreateButton,
  Section,
  SectionCaption,
  SectionHeader,
} from "../components"
import { SiteEditLayout } from "../layouts"

import {
  MediaDirectoryCard,
  ImagePreviewCard,
  FilePreviewCard,
  MediaBreadcrumbs,
} from "./components"

interface MediaLabels {
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
      singularMediaLabel: "file",
      pluralMediaLabel: "files",
      singularDirectoryLabel: "directory",
      pluralDirectoryLabel: "directories",
    }
  }

  return {
    singularMediaLabel: "image",
    pluralMediaLabel: "images",
    singularDirectoryLabel: "album",
    pluralDirectoryLabel: "albums",
  }
}

export const Media = (): JSX.Element => {
  const history = useHistory()
  const [curPage, setCurPage] = usePaginate()
  const { params, path, url } = useRouteMatch<{
    siteName: string
    mediaRoom: "files" | "images"
    mediaDirectoryName: string
  }>()
  const { siteName, mediaRoom: mediaType } = params

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
  })

  const files = useGetAllMediaFiles(
    mediaFolderFiles?.files || [],
    params.siteName,
    params.mediaDirectoryName
  )

  const {
    singularMediaLabel,
    pluralMediaLabel,
    singularDirectoryLabel,
    pluralDirectoryLabel,
  } = getMediaLabels(mediaType)
  const isWriteDisabled = isWriteActionsDisabled(siteName)

  return (
    <>
      <SiteEditLayout overflow="hidden">
        <Section>
          <Box>
            <Text as="h4" textStyle="h4">
              {_.upperFirst(mediaType)}
            </Text>
            <MediaBreadcrumbs />
          </Box>
        </Section>
        <Section>
          <SectionHeader label={_.upperFirst(pluralDirectoryLabel)}>
            <Greyscale isActive={isWriteDisabled}>
              <CreateButton as={Link} to={`${url}/createDirectory`}>
                {`Create ${singularDirectoryLabel}`}
              </CreateButton>
            </Greyscale>
          </SectionHeader>
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
        </Section>
        <Section>
          <Box w="100%">
            <SectionHeader label={`Ungrouped ${pluralMediaLabel}`}>
              <Greyscale isActive={isWriteDisabled}>
                <Button
                  as={Link}
                  to={`${url}/createMedia`}
                  leftIcon={<BiUpload fontSize="1.5rem" />}
                  variant="outline"
                >
                  {`Upload ${singularMediaLabel}`}
                </Button>
              </Greyscale>
            </SectionHeader>
            <SectionCaption label="PRO TIP: " icon={BiBulb}>
              Upload {pluralMediaLabel} here to link to them in pages and
              resources. The maximum {singularMediaLabel} size allowed is 5MB.{" "}
              <br />
              For {pluralMediaLabel} other than
              {mediaType === "images"
                ? ` 'png', 'jpg', '.jpeg', 'gif', 'tif', '.tiff', 'bmp', 'ico', 'svg'`
                : ` 'pdf'`}
              , please use
              <Link to={{ pathname: `https://go.gov.sg` }} target="_blank">
                {" "}
                https://go.gov.sg{" "}
              </Link>{" "}
              to upload and link them to your Isomer site.
            </SectionCaption>
          </Box>
          <Skeleton
            w="100%"
            h={isListMediaFilesLoading ? "4.5rem" : "fit-content"}
            isLoaded={!isListMediaFilesLoading}
          >
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
                        mediaUrl={data.mediaUrl}
                      />
                    ) : (
                      data && <FilePreviewCard name={data.name} />
                    )}
                  </Skeleton>
                )
              })}
            </SimpleGrid>
            {files && mediaFolderFiles && mediaFolderFiles?.total > 0 && (
              <Center mt="1rem">
                <Pagination
                  totalCount={mediaFolderFiles.total}
                  pageSize={MEDIA_PAGINATION_SIZE}
                  currentPage={curPage}
                  onPageChange={(page) => setCurPage(page)}
                />
              </Center>
            )}
          </Skeleton>
        </Section>
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
