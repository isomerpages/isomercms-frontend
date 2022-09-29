// Import components
import { Icon, Skeleton, Text } from "@chakra-ui/react"
import { EmptyArea } from "components/EmptyArea"
import {
  MenuDropdownButton,
  MenuDropdownItem,
} from "components/MenuDropdownButton"
import { BiFolder, BiFileBlank } from "react-icons/bi"
import { Switch, useRouteMatch, useHistory, Link } from "react-router-dom"

// Import hooks
import {
  useGetFoldersAndPages,
  useGetWorkspacePages,
} from "hooks/directoryHooks"

// Import screens
import { CreateButton } from "layouts/components"
import {
  PageSettingsScreen,
  MoveScreen,
  DeleteWarningScreen,
  DirectoryCreationScreen,
  DirectorySettingsScreen,
} from "layouts/screens"

import { ProtectedRouteWithProps } from "routing/ProtectedRouteWithProps"

import { isDirData } from "types/utils"

import { SiteViewContent, SiteViewLayout } from "../layouts"

import { MainPages } from "./components/MainPages"
import { UngroupedPages } from "./components/UngroupedPages"
import { WorkspaceFolders } from "./components/WorkspaceFolder"

const WorkspacePage = (): JSX.Element => {
  const {
    params: { siteName },
    url,
  } = useRouteMatch<{ siteName: string }>()

  const {
    isLoading: isDirLoading,
    data: _dirsAndPagesData,
  } = useGetFoldersAndPages({
    siteName,
  })
  const { data: _pagesData } = useGetWorkspacePages(siteName)

  const pagesData = _pagesData || []
  const dirsData = (_dirsAndPagesData || []).filter(isDirData)
  const isPagesEmpty =
    pagesData.filter((page) => page.name !== "contact-us.md").length === 0
  const isFoldersEmpty = !dirsData || dirsData.length === 0

  return (
    <SiteViewLayout overflow="hidden">
      <MainPages siteName={siteName} isLoading={!!pagesData} />
      <Skeleton isLoaded={!isDirLoading} w="100%">
        <EmptyArea
          isItemEmpty={isFoldersEmpty && isPagesEmpty}
          actionButton={
            <MenuDropdownButton
              variant="outline"
              mainButtonText="Create page"
              as={Link}
              to={`${url}/createPage`}
            >
              <MenuDropdownItem
                as={Link}
                to={`${url}/createPage`}
                icon={
                  <Icon as={BiFileBlank} fontSize="1.25rem" fill="icon.alt" />
                }
              >
                <Text textStyle="body-1" fill="text.body">
                  Create page
                </Text>
              </MenuDropdownItem>
              <MenuDropdownItem
                as={Link}
                to={`${url}/createDirectory`}
                icon={<Icon as={BiFolder} fontSize="1.25rem" fill="icon.alt" />}
              >
                <Text textStyle="body-1" fill="text.body">
                  Create folder
                </Text>
              </MenuDropdownItem>
            </MenuDropdownButton>
          }
        >
          <SiteViewContent>
            <EmptyArea
              isItemEmpty={isFoldersEmpty}
              actionButton={
                <CreateButton as={Link} to={`${url}/createDirectory`}>
                  Create folder
                </CreateButton>
              }
            >
              <WorkspaceFolders
                siteName={siteName}
                pagesData={pagesData}
                url={url}
                dirsData={dirsData}
              />
            </EmptyArea>
            <EmptyArea
              isItemEmpty={isPagesEmpty}
              actionButton={
                <CreateButton as={Link} to={`${url}/createPage`}>
                  Create page
                </CreateButton>
              }
            >
              <UngroupedPages pagesData={pagesData} url={url} />
            </EmptyArea>
          </SiteViewContent>
        </EmptyArea>
      </Skeleton>
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
