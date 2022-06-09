// Import components
import { SimpleGrid, Box, Skeleton, Text } from "@chakra-ui/react"
import { useEffect, useState } from "react"
import { BiBulb, BiInfoCircle } from "react-icons/bi"
import { Switch, useRouteMatch, useHistory } from "react-router-dom"

// Import hooks
import { useGetDirectoryHook } from "hooks/directoryHooks"
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

import { ProtectedRouteWithProps } from "routing/RouteSelector"

import { Section, SectionHeader, SectionCaption } from "../components"
import { SiteViewLayout } from "../layouts"

import {
  ContactCard,
  PageCard,
  NavigationCard,
  FolderCard,
  HomepageCard,
  CreateButton,
} from "./components"

const CONTACT_US_TEMPLATE_LAYOUT = "contact_us"

interface WorkspaceProps {
  match: {
    params: {
      siteName: string
    }
  }
  location: {
    pathname: string
  }
}

interface DirectoryData {
  name: string
}

const isDirectoryData = (
  possibleDir: unknown
): possibleDir is DirectoryData => {
  return !!(possibleDir as DirectoryData).name
}

interface PageData {
  name: string
  resourceType?: "file" | "post"
}

const isPageData = (possiblePage: unknown): possiblePage is PageData => {
  const hasPermissibleResourceType =
    (possiblePage as PageData).resourceType === "file" ||
    (possiblePage as PageData).resourceType === "post" ||
    !(possiblePage as PageData).resourceType

  return !!(possiblePage as PageData).name && hasPermissibleResourceType
}

export const Workspace = ({ match, location }: WorkspaceProps): JSX.Element => {
  const { siteName } = match.params
  const [contactUsCard, setContactUsCard] = useState<boolean | undefined>()

  const { setRedirectToPage } = useRedirectHook()
  const { path, url } = useRouteMatch()
  const history = useHistory()

  const { data: _dirsData } = useGetDirectoryHook(match.params)
  const { data: _pagesData } = useGetDirectoryHook({
    ...match.params,
    isUnlinked: true,
  })
  const { data: contactUsPage } = useGetPageHook({
    siteName,
    fileName: "contact-us.md",
  })

  // NOTE: These are obtained from JS files and are potentially unsafe
  // Do a type-check to narrow down to only those that are permissible and ensure safety
  const dirsData =
    _dirsData && _dirsData.length > 0
      ? (_dirsData as unknown[]).filter(isDirectoryData)
      : []
  const pagesData =
    _pagesData && _pagesData.length > 0
      ? (_pagesData as unknown[]).filter(isPageData)
      : []

  useEffect(() => {
    if (contactUsPage)
      setContactUsCard(
        contactUsPage.content?.frontMatter?.layout ===
          CONTACT_US_TEMPLATE_LAYOUT
      )
  }, [pagesData, contactUsPage])

  return (
    <>
      <SiteViewLayout overflow="auto">
        <Section>
          <Text as="h2" textStyle="h2">
            My Workspace
          </Text>
          <Skeleton isLoaded={!!pagesData} w="full">
            <SimpleGrid columns={3} spacing="1.5rem">
              <HomepageCard siteName={siteName} />
              <NavigationCard siteName={siteName} />
              {contactUsCard && <ContactCard siteName={siteName} />}
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
          <Skeleton isLoaded={!!pagesData} w="full">
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
            <SectionHeader label="Pages">
              <CreateButton
                onClick={() => setRedirectToPage(`${url}/createPage`)}
              >
                Create page
              </CreateButton>
            </SectionHeader>
            <SectionCaption label="NOTE: " icon={BiInfoCircle}>
              Pages here do not belong to any folders
            </SectionCaption>
          </Box>
          <Skeleton isLoaded={!!pagesData} w="full">
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
    </>
  )
}
