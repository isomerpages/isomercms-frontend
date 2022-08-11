import { SimpleGrid, Box, Skeleton, Text } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import { FolderCard } from "components/FolderCard"
import FolderOptionButton from "components/FolderOptionButton"
import Header from "components/Header"
import { Sidebar } from "components/Sidebar"
import { BiBulb, BiUpload } from "react-icons/bi"
import {
  Link,
  Switch,
  useRouteMatch,
  useHistory,
  match,
} from "react-router-dom"

import { useGetMediaFolders } from "hooks/directoryHooks"
import useRedirectHook from "hooks/useRedirectHook"

import { DeleteWarningScreen } from "layouts/screens/DeleteWarningScreen"
import { DirectoryCreationScreen } from "layouts/screens/DirectoryCreationScreen"
import { DirectorySettingsScreen } from "layouts/screens/DirectorySettingsScreen"
import { MediaCreationScreen } from "layouts/screens/MediaCreationScreen"
import { MediaSettingsScreen } from "layouts/screens/MediaSettingsScreen"
import { MoveScreen } from "layouts/screens/MoveScreen"

import { ProtectedRouteWithProps } from "routing/ProtectedRouteWithProps"

import elementStyles from "styles/isomer-cms/Elements.module.scss"
import contentStyles from "styles/isomer-cms/pages/Content.module.scss"
import mediaStyles from "styles/isomer-cms/pages/Media.module.scss"

import { getDecodedParams } from "utils/decoding"

import { DirectoryData, MediaData } from "types/directory"

import {
  CreateButton,
  Section,
  SectionCaption,
  SectionHeader,
} from "../components"
import { SiteViewLayout } from "../layouts"

import { MediaDirectoryCard, MediaPreviewCard } from "./components"

const Media = (): JSX.Element => {
  const history = useHistory()
  const { params, path, url } = useRouteMatch<{
    siteName: string
    mediaRoom: "files" | "images"
    mediaDirectoryName: string
  }>()
  const { mediaRoom: mediaType } = params
  const { setRedirectToPage } = useRedirectHook()

  const { data: mediasData } = useGetMediaFolders(params)

  return (
    <>
      <SiteViewLayout overflow="hidden">
        <Section>
          <Box>
            <Text as="h2" textStyle="h2">
              {mediaType[0].toUpperCase() + mediaType.substring(1)}
            </Text>
            {/* TODO: create breadcrumb for media  */}
          </Box>
        </Section>
        <Section>
          <SectionHeader label="Albums">
            <CreateButton as={Link} to={`${url}/createMedia`}>
              {`Create ${mediaType === "images" ? "album" : "directory"}`}
            </CreateButton>
          </SectionHeader>
          <SimpleGrid w="100%" columns={3} spacing="1.5rem">
            {mediasData
              ?.filter((media) => (media as DirectoryData).type === "dir")
              .map(({ name }) => {
                return <MediaDirectoryCard title={name} />
              })}
          </SimpleGrid>
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
                {`Upload ${mediaType === "images" ? "image" : "file"}`}
              </Button>
            </SectionHeader>
            <SectionCaption label="PRO TIP: " icon={BiBulb}>
              Upload {mediaType} here to link to them in pages and resources.
              The maximum {mediaType.slice(0, -1)} size allowed is 5MB. <br />
              For {mediaType} other than
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
          <SimpleGrid columns={3} spacing="1.5rem" w="100%">
            {mediasData
              ?.filter((media) => (media as MediaData).sha !== undefined)
              .map((x) => x as MediaData)
              .map(({ name, mediaUrl }) => {
                return <MediaPreviewCard name={name} mediaUrl={mediaUrl} />
              })}
          </SimpleGrid>
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

export default Media
