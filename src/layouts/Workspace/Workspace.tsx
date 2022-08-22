// Import components
import { Skeleton } from "@chakra-ui/react"
import { Switch, useRouteMatch, useHistory } from "react-router-dom"

// Import hooks
import {
  useGetFoldersAndPages,
  useGetWorkspacePages,
} from "hooks/directoryHooks"

// Import screens
import {
  PageSettingsScreen,
  MoveScreen,
  DeleteWarningScreen,
  DirectoryCreationScreen,
  DirectorySettingsScreen,
} from "layouts/screens"

import { ProtectedRouteWithProps } from "routing/ProtectedRouteWithProps"

import { DirectoryData } from "types/directory"

import { ContentGridLayout, SiteViewLayout } from "../layouts"

import {
  EmptyFolder,
  EmptyPage,
  EmptyPageAndFolder,
  MainPages,
  UngroupedPages,
  WorkspaceFolders,
} from "./components/WorkspacePagesAndFoldersComponents"

const WorkspacePage = (): JSX.Element => {
  const {
    params: { siteName },
  } = useRouteMatch<{ siteName: string }>()

  const { url } = useRouteMatch()
  const { isLoading: isDirLoading } = useGetFoldersAndPages({
    siteName,
  })
  const { data: _pagesData } = useGetWorkspacePages(siteName)

  const pagesData = _pagesData || []

  const { data: _dirsAndPagesData } = useGetFoldersAndPages({ siteName })
  const dirsData = (_dirsAndPagesData || []).filter((data) => {
    return data.type === "dir" // only get directories and not pages
  }) as DirectoryData[]
  const isPagesEmpty =
    pagesData.filter((page) => page.name !== "contact-us.md").length === 0
  const isFoldersEmpty = !dirsData || dirsData.length === 0

  const isBothPagesAndFoldersEmpty = isFoldersEmpty && isPagesEmpty

  return (
    <>
      <SiteViewLayout overflow="hidden">
        <MainPages siteName={siteName} isLoading={!!pagesData} />
        <Skeleton isLoaded={!isDirLoading} w="100%">
          {isBothPagesAndFoldersEmpty ? (
            <EmptyPageAndFolder />
          ) : (
            <ContentGridLayout>
              {isFoldersEmpty ? (
                <EmptyFolder url={url} />
              ) : (
                <WorkspaceFolders
                  siteName={siteName}
                  pagesData={pagesData}
                  url={url}
                  dirsData={dirsData}
                />
              )}
              {isPagesEmpty ? (
                <EmptyPage url={url} />
              ) : (
                <UngroupedPages pagesData={pagesData} url={url} />
              )}
            </ContentGridLayout>
          )}
        </Skeleton>
      </SiteViewLayout>
    </>
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
