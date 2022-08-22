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

import { SiteViewLayout } from "../layouts"

import { MainPages } from "./components/WorkspacePagesAndFoldersComponents"
import { FoldersAndPagesController } from "./FoldersAndPagesController"

const WorkspacePage = (): JSX.Element => {
  const {
    params: { siteName },
    url,
  } = useRouteMatch<{ siteName: string }>()

  const { isLoading: isDirLoading } = useGetFoldersAndPages({
    siteName,
  })
  const { data: _pagesData } = useGetWorkspacePages(siteName)

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
