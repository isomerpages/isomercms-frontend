import { SimpleGrid, Box, Text, Skeleton, Center } from "@chakra-ui/react"
import { Button, Pagination } from "@opengovsg/design-system-react"
import _ from "lodash"
import { useEffect, useState } from "react"
import { BiBulb, BiUpload } from "react-icons/bi"
import { Link, Switch, useRouteMatch, useHistory } from "react-router-dom"

import { Greyscale } from "components/Greyscale"

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

const MEDIA_PAGINATION_SIZE = 15

export const Media = (): JSX.Element => {
  const history = useHistory()
  const [curPage, setCurPage] = usePaginate()
  const { params, path, url } = useRouteMatch<{
    siteName: string
    mediaRoom: "files" | "images"
    mediaDirectoryName: string
  }>()
  const { siteName, mediaRoom: mediaType } = params
  const [originalMediaType, setOriginalMediaType] = useState(mediaType)

  useEffect(() => {
    // NOTE: Because this component is shared between different media types,
    // we need to reset the page number to 1 when the media type changes.
    // If this is not done, we might end up with erroneous pagination
    // such as being on page 4 of a 1 page list.
    // This results in the back button being clickable,
    // but the number always being 1.
    if (originalMediaType !== mediaType) {
      setCurPage(1)
      // NOTE: Keep state in sync here
      setOriginalMediaType(mediaType)
    }
  }, [curPage, originalMediaType, setOriginalMediaType, mediaType, setCurPage])

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
              {mediaFolderFiles?.files.map(({ name, mediaUrl }) => {
                if (mediaType === "images") {
                  return <ImagePreviewCard name={name} mediaUrl={mediaUrl} />
                }
                return <FilePreviewCard name={name} />
              })}
            </SimpleGrid>
            {mediaFolderFiles && mediaFolderFiles?.total > 0 && (
              <Center mt="1rem">
                <Pagination
                  totalCount={mediaFolderFiles?.total || 0}
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
