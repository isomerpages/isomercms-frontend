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
import { SiteViewLayout } from "../layouts"

import {
  MediaDirectoryCard,
  ImagePreviewCard,
  FilePreviewCard,
  MediaBreadcrumbs,
} from "./components"

interface MediaLabels {
  singularMediaLabel: "file" | "image"
  pluralMediaLabel: "files" | "images"
  directoryLabel: "directory" | "album"
}

// Utility method to help ease over the various labels associated
// with the media type so that we can avoid repeated conditionals
const getMediaLabels = (mediaType: "files" | "images"): MediaLabels => {
  if (mediaType === "files") {
    return {
      singularMediaLabel: "file",
      pluralMediaLabel: "files",
      directoryLabel: "directory",
    }
  }

  return {
    singularMediaLabel: "image",
    pluralMediaLabel: "images",
    directoryLabel: "album",
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
    directoryLabel,
  } = getMediaLabels(mediaType)

  return (
    <>
      <SiteViewLayout overflow="hidden">
        <Section>
          <Box>
            <Text as="h2" textStyle="h2">
              {_.upperFirst(mediaType)}
            </Text>
            <MediaBreadcrumbs />
          </Box>
        </Section>
        <Section>
          <SectionHeader label="Albums">
            <CreateButton as={Link} to={`${url}/createMedia`}>
              {`Create ${directoryLabel}`}
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
            <SectionHeader label="Ungrouped Images">
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
                ? ` 'png', 'jpg', 'gif', 'tif', 'bmp', 'ico', 'svg'`
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
      </SiteViewLayout>
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
