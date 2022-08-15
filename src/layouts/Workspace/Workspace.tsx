// Import components
import {
  Box,
  GridItem,
  SimpleGrid,
  Skeleton,
  StackDivider,
  Text,
  VStack,
} from "@chakra-ui/react"
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

import { DirectoryData, PageData } from "types/directory"
import { isDirData } from "types/utils"

import {
  CreateButton,
  Section,
  SectionCaption,
  SectionHeader,
} from "../components"
import { SiteViewLayout } from "../layouts"

import {
  PageCard,
  FolderCard,
  NavigationCard,
  HomepageCard,
  ContactCard,
} from "./components"
import { FoldersAndPagesController } from "./FoldersAndPagesController"
import {
  EmptyPageAndFolder,
  EmptyFolder,
  EmptyPage,
} from "./WorkspacePagesAndFoldersComponents"

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

export const Folders = (props: {
  siteName: string
  pagesData: (PageData | DirectoryData)[]
  url: string
  dirsData: (PageData | DirectoryData)[]
}): JSX.Element => {
  const { setRedirectToPage } = useRedirectHook()
  const { siteName, pagesData, url, dirsData } = props

  return (
    <>
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
    </>
  )
}

export const UngroupedPages = (props: {
  pagesData: (PageData | DirectoryData)[]
  url: string
}): JSX.Element => {
  const { pagesData, url } = props
  const { setRedirectToPage } = useRedirectHook()
  return (
    <>
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
        <Skeleton isLoaded={!!pagesData} w="full">
          <SimpleGrid columns={3} spacing="1.5rem">
            {pagesData &&
              pagesData.length > 0 &&
              pagesData
                .filter((page) => page.name !== "contact-us.md")
                .map(({ name }) => <PageCard title={name} />)}
          </SimpleGrid>
        </Skeleton>
      </Section>
    </>
  )
}

export const FoldersAndUngroupedPagesController = (props: {
  siteName: string
  url: string
  pagesData: (PageData | DirectoryData)[]
}): JSX.Element => {
  const { siteName, url, pagesData } = props
  const { data: _dirsData } = useGetFolders({ siteName })
  const dirsData = _dirsData || []
  const isPagesEmpty =
    pagesData.filter((page) => page.name !== "contact-us.md").length === 0
  const isFoldersEmpty = !dirsData || dirsData.length === 0

  if (isPagesEmpty && isFoldersEmpty) {
    return <EmptyPageAndFolder url={url} />
  }

  if (isFoldersEmpty) {
    return (
      <GridItem
        area="content"
        as={VStack}
        spacing="2rem"
        bgColor="gray.50"
        w="100%"
        h="100%"
        divider={<StackDivider borderColor="border.divider.alt" />}
      >
        <EmptyFolder url={url} />
        <UngroupedPages pagesData={pagesData} url={url} />
      </GridItem>
    )
  }

  if (isPagesEmpty) {
    return (
      <GridItem
        area="content"
        as={VStack}
        spacing="2rem"
        bgColor="gray.50"
        w="100%"
        h="100%"
        divider={<StackDivider borderColor="border.divider.alt" />}
      >
        <Folders
          siteName={siteName}
          pagesData={pagesData}
          url={url}
          dirsData={dirsData}
        />
        <EmptyPage url={url} />
      </GridItem>
    )
  }

  return (
    <GridItem
      area="content"
      as={VStack}
      spacing="2rem"
      bgColor="gray.50"
      w="100%"
      h="100%"
      divider={<StackDivider borderColor="border.divider.alt" />}
    >
      <Folders
        siteName={siteName}
        pagesData={pagesData}
        url={url}
        dirsData={dirsData}
      />
      <UngroupedPages pagesData={pagesData} url={url} />
    </GridItem>
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
