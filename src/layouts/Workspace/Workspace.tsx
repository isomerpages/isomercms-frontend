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

const CONTACT_US_TEMPLATE_LAYOUT = "contact_us"

const WorkspacePage = (): JSX.Element => {
  const {
    params: { siteName },
  } = useRouteMatch<{ siteName: string }>()

  const { setRedirectToPage } = useRedirectHook()
  const { url } = useRouteMatch()
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

  const dirsData = _dirsData || []
  const pagesData = _pagesData || []

  return (
    <SiteViewLayout overflow="hidden">
      <Section>
        <Text as="h2" textStyle="h2">
          My Workspace
        </Text>
        <Skeleton isLoaded={!isContactUsLoading} w="full">
          <SimpleGrid columns={3} spacing="1.5rem">
            <HomepageCard siteName={siteName} />
            <NavigationCard siteName={siteName} />
            {hasContactUsCard && <ContactCard siteName={siteName} />}
          </SimpleGrid>
        </Skeleton>
      </Section>

      <Section>
        <Box w="100%">
          <SectionHeader label="Folders">
            <CreateButton
              onClick={() => setRedirectToPage(`${url}/createDirectory`)}
            >
              Create folder
            </CreateButton>
          </SectionHeader>
          <SectionCaption label="PRO TIP: " icon={BiBulb}>
            Folders impact navigation on your site. Organise your workspace by
            moving pages into folders.
          </SectionCaption>
        </Box>
        <Skeleton
          isLoaded={!isDirLoading}
          w="full"
          h={isDirLoading ? "4.5rem" : "fit-content"}
        >
          <SimpleGrid columns={3} spacing="1.5rem">
            {dirsData &&
              dirsData.length > 0 &&
              dirsData.map(({ name }) => (
                <FolderCard title={name} siteName={siteName} />
              ))}
          </SimpleGrid>
        </Skeleton>
      </Section>

      <Section>
        <Box w="100%">
          <SectionHeader label="Ungrouped Pages">
            <CreateButton
              onClick={() => setRedirectToPage(`${url}/createPage`)}
            >
              Create page
            </CreateButton>
          </SectionHeader>
          <SectionCaption label="NOTE: " icon={BiInfoCircle}>
            Pages here do not belong to any folders.
          </SectionCaption>
        </Box>
        <Skeleton
          isLoaded={!isPagesLoading}
          w="full"
          h={isDirLoading ? "4.5rem" : "fit-content"}
        >
          <SimpleGrid columns={3} spacing="1.5rem">
            {pagesData &&
              pagesData.length > 0 &&
              pagesData
                .filter((page) => page.name !== "contact-us.md")
                .map(({ name, resourceType }) => (
                  <PageCard title={name} resourceType={resourceType} />
                ))}
          </SimpleGrid>
        </Skeleton>
      </Section>
    </SiteViewLayout>
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
