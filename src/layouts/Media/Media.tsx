import { SimpleGrid, Box, Text, Skeleton } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import _ from "lodash"
import { BiBulb, BiUpload } from "react-icons/bi"
import { Link, Switch, useRouteMatch, useHistory } from "react-router-dom"

import { useGetMediaFolders } from "hooks/directoryHooks"

import { DeleteWarningScreen } from "layouts/screens/DeleteWarningScreen"
import { DirectoryCreationScreen } from "layouts/screens/DirectoryCreationScreen"
import { DirectorySettingsScreen } from "layouts/screens/DirectorySettingsScreen"
import { MediaCreationScreen } from "layouts/screens/MediaCreationScreen"
import { MediaSettingsScreen } from "layouts/screens/MediaSettingsScreen"
import { MoveScreen } from "layouts/screens/MoveScreen"

import { ProtectedRouteWithProps } from "routing/ProtectedRouteWithProps"

import { isDirData, isMediaData } from "types/utils"

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
  const { params, path, url } = useRouteMatch<{
    siteName: string
    mediaRoom: "files" | "images"
    mediaDirectoryName: string
  }>()
  const { mediaRoom: mediaType } = params
  const { data: mediasData, isLoading } = useGetMediaFolders(params)
  const {
    singularMediaLabel,
    pluralMediaLabel,
    singularDirectoryLabel,
    pluralDirectoryLabel,
  } = getMediaLabels(mediaType)

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
            <CreateButton as={Link} to={`${url}/createDirectory`}>
              {`Create ${singularDirectoryLabel}`}
            </CreateButton>
          </SectionHeader>
          <Skeleton
            w="100%"
            h={isLoading ? "4.5rem" : "fit-content"}
            isLoaded={!isLoading}
          >
            <SimpleGrid w="100%" columns={3} spacing="1.5rem">
              {mediasData?.filter(isDirData).map(({ name }) => {
                return <MediaDirectoryCard title={name} />
              })}
            </SimpleGrid>
          </Skeleton>
        </Section>
        <Section>
          <Box w="100%">
            <SectionHeader label={`Ungrouped ${pluralMediaLabel}`}>
              <Button
                as={Link}
                to={`${url}/createMedia`}
                leftIcon={<BiUpload fontSize="1.5rem" />}
                variant="outline"
              >
                {`Upload ${singularMediaLabel}`}
              </Button>
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
            h={isLoading ? "4.5rem" : "fit-content"}
            isLoaded={!isLoading}
          >
            <SimpleGrid columns={3} spacing="1.5rem" w="100%">
              {mediasData?.filter(isMediaData).map(({ name, mediaUrl }) => {
                if (mediaType === "images") {
                  return <ImagePreviewCard name={name} mediaUrl={mediaUrl} />
                }
                return <FilePreviewCard name={name} />
              })}
            </SimpleGrid>
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
