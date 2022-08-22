// Import components
import { SimpleGrid, Box, Skeleton, Text } from "@chakra-ui/react"
import { BiBulb, BiInfoCircle } from "react-icons/bi"
import { Switch, useRouteMatch, useHistory } from "react-router-dom"

// Import hooks
import { useGetFolders, useGetWorkspacePages } from "hooks/directoryHooks"
import { useGetPageHook } from "hooks/pageHooks"
import useRedirectHook from "hooks/useRedirectHook"

// Import screens
import {
  PageSettingsScreen,
  MoveScreen,
  DeleteWarningScreen,
  DirectoryCreationScreen,
  DirectorySettingsScreen,
} from "layouts/screens"

import { ProtectedRouteWithProps } from "routing/ProtectedRouteWithProps"

import { PageData } from "types/directory"
import { isDirData } from "types/utils"

import {
  Section,
  SectionHeader,
  SectionCaption,
  CreateButton,
} from "../components"
import { SiteViewLayout } from "../layouts"

import {
  ContactCard,
  PageCard,
  NavigationCard,
  FolderCard,
  HomepageCard,
} from "./components"
import { FoldersAndPagesController } from "./FoldersAndPagesController"

const CONTACT_US_TEMPLATE_LAYOUT = "contact_us"

const WorkspacePage = (): JSX.Element => {
  const {
    params: { siteName },
    url,
  } = useRouteMatch<{ siteName: string }>()

  const { setRedirectToPage } = useRedirectHook()
  const { data: _dirsData, isLoading: isDirLoading } = useGetFolders({
    siteName,
  })
  const { data: _pagesData, isLoading: isPagesLoading } = useGetWorkspacePages(
    siteName
  )
  const { data: contactUsPage, isLoading: isContactUsLoading } = useGetPageHook(
    {
      siteName,
      fileName: "contact-us.md",
    }
  )

  const hasContactUsCard =
    contactUsPage?.content?.frontMatter?.layout === CONTACT_US_TEMPLATE_LAYOUT

  const dirsData = _dirsData?.filter(isDirData) || []
  const pagesData = _pagesData || []

  return (
    <>
      <SiteViewLayout overflow="hidden">
        <MainPages siteName={siteName} pagesData={pagesData} />
        <Skeleton isLoaded={!isDirLoading} w="100%">
          <FoldersAndPagesController
            siteName={siteName}
            url={url}
            pagesData={pagesData}
          />
        </Skeleton>
      </SiteViewLayout>
    </>
  )
}

// refers to the homepage, navigation bar and contact us pages.
export const MainPages = (props: {
  siteName: string
  pagesData: PageData[]
}): JSX.Element => {
  const { siteName, pagesData } = props
  const { data: contactUsPage } = useGetPageHook({
    siteName,
    fileName: "contact-us.md",
  })
  const hasContactUsCard =
    contactUsPage?.content?.frontMatter?.layout === CONTACT_US_TEMPLATE_LAYOUT
  return (
    <Section>
      <Text as="h2" textStyle="h2">
        My Workspace
      </Text>
      <Skeleton isLoaded={!!pagesData} w="full">
        <SimpleGrid columns={3} spacing="1.5rem">
          <HomepageCard siteName={siteName} />
          <NavigationCard siteName={siteName} />
          {hasContactUsCard && <ContactCard siteName={siteName} />}
        </SimpleGrid>
      </Skeleton>
    </Section>
  )
}

const WorkspaceRouter = (): JSX.Element => {
  const { path } = useRouteMatch()
  const history = useHistory()

  return (
    <Switch>
      <ProtectedRouteWithProps
        path={[`${path}/createPage`, `${path}/editPageSettings/:fileName`]}
        component={PageSettingsScreen}
        onClose={() => history.goBack()}
      />
      <ProtectedRouteWithProps
        path={[`${path}/deletePage/:fileName`]}
        component={DeleteWarningScreen}
        onClose={() => history.goBack()}
      />
      <ProtectedRouteWithProps
        path={[`${path}/movePage/:fileName`]}
        component={MoveScreen}
        onClose={() => history.goBack()}
      />
      <ProtectedRouteWithProps
        path={[`${path}/createDirectory`]}
        component={DirectoryCreationScreen}
        onClose={() => history.goBack()}
      />
      <ProtectedRouteWithProps
        path={[`${path}/deleteDirectory/:collectionName`]}
        component={DeleteWarningScreen}
        onClose={() => history.goBack()}
      />
      <ProtectedRouteWithProps
        path={[`${path}/editDirectorySettings/:collectionName`]}
        component={DirectorySettingsScreen}
        onClose={() => history.goBack()}
      />
    </Switch>
  )
}

export const Workspace = (): JSX.Element => {
  return (
    <>
      <WorkspacePage />
      <WorkspaceRouter />
    </>
  )
}
