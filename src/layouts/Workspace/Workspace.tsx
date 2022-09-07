// Import components
import { Skeleton } from "@chakra-ui/react"
import { EmptyArea } from "components/EmptyArea"
import { Switch, useRouteMatch, useHistory, Link } from "react-router-dom"

// Import hooks
import {
  useGetFoldersAndPages,
  useGetWorkspacePages,
} from "hooks/directoryHooks"

// Import screens
import { CreateButton } from "layouts/components"
import { MenuDropdownButton } from "layouts/Folders/components/MenuDropdownButton"
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

import { MainPages } from "./components/MainPagesComponent"
import { UngroupedPages } from "./components/UngroupedPagesComponent"
import { WorkspaceFolders } from "./components/WorkspaceFolderComponent"

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
          actionButton={<MenuDropdownButton />}
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
              <UngroupedPages pagesData={pagesData} url="" />
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
