import React from "react"
import PropTypes from "prop-types"
import { ReactQueryDevtools } from "react-query/devtools"
import {
  Link,
  Route,
  Switch,
  useRouteMatch,
  useHistory,
} from "react-router-dom"
import _ from "lodash"

// Import components
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"

import FolderOptionButton from "../components/FolderOptionButton"
import { FolderContent } from "../components/folders/FolderContent"

import {
  FoldersPageSettingsScreen,
  FoldersPageMoveScreen,
  FoldersDirectoryCreationScreen,
  FoldersDirectorySettingsScreen,
  FoldersReorderingScreen,
  FoldersDeleteWarningScreen,
} from "./foldersScreens"

import useRedirectHook from "../hooks/useRedirectHook"

import { deslugifyDirectory, getLastItemType } from "../utils"

// Import styles
import elementStyles from "../styles/isomer-cms/Elements.module.scss"
import contentStyles from "../styles/isomer-cms/pages/Content.module.scss"

import { useGetDirectoryHook } from "../hooks/directoryHooks"

const Folders = ({ match, location }) => {
  const { siteName, subCollectionName, collectionName } = match.params

  const { path, url } = useRouteMatch()
  const history = useHistory()

  const { setRedirectToPage } = useRedirectHook()

  const { data: dirData, isLoading: isLoadingDirectory } = useGetDirectoryHook(
    match.params
  )
  return (
    <>
      <Header
        siteName={siteName}
        backButtonText={`Back to ${
          subCollectionName ? collectionName : "Workspace"
        }`}
        backButtonUrl={`/sites/${siteName}/${
          subCollectionName ? `folders/${collectionName}` : "workspace"
        }`}
        shouldAllowEditPageBackNav
        isEditPage
      />
      {/* main bottom section */}
      <div className={elementStyles.wrapper}>
        <Sidebar siteName={siteName} currPath={location.pathname} />
        {/* main section starts here */}
        <div className={contentStyles.mainSection}>
          {/* Page title */}
          <div className={contentStyles.sectionHeader}>
            <h1 className={contentStyles.sectionTitle}>
              {match.params[getLastItemType(match.params)]}
            </h1>
          </div>
          {/* Info segment */}
          <div className={contentStyles.segment}>
            <i className="bx bx-sm bx-bulb text-dark" />
            <span>
              <strong className="ml-1">Pro tip:</strong> You can make a new
              section by creating subfolders
            </span>
          </div>
          {/* Segment divider  */}
          <div className={contentStyles.segmentDividerContainer}>
            <hr className="w-100 mt-3 mb-5" />
          </div>
          {/* Collections title */}
          <div className={contentStyles.segment}>
            <span>
              <Link to={`/sites/${siteName}/workspace`}>
                <strong>Workspace</strong>
              </Link>
              &nbsp;
              {">"}
              {collectionName ? (
                subCollectionName ? (
                  <Link to={`/sites/${siteName}/folders/${collectionName}`}>
                    <strong className="ml-1">
                      &nbsp;
                      {deslugifyDirectory(collectionName)}
                    </strong>
                  </Link>
                ) : (
                  <strong className="ml-1">
                    &nbsp;
                    {deslugifyDirectory(collectionName)}
                  </strong>
                )
              ) : null}
              {collectionName && subCollectionName ? (
                <span>
                  &nbsp;
                  {">"}
                  <strong className="ml-1">
                    &nbsp;
                    {subCollectionName}
                  </strong>
                </span>
              ) : null}
            </span>
          </div>
          {/* Options */}
          <div className={contentStyles.contentContainerFolderRowMargin}>
            <FolderOptionButton
              title="Rearrange items"
              onClick={() => setRedirectToPage(`${url}/rearrange`)}
              option="rearrange"
              isDisabled={!dirData || dirData.length <= 1}
            />
            <FolderOptionButton
              title="Create new page"
              option="create-page"
              id="pageSettings-new"
              onClick={() => setRedirectToPage(`${url}/createPage`)}
            />
            <FolderOptionButton
              title="Create new subfolder"
              option="create-sub"
              isDisabled={!!(subCollectionName || isLoadingDirectory)}
              onClick={() => setRedirectToPage(`${url}/createFolder`)}
            />
          </div>
          {/* Collections content */}
          <FolderContent dirData={dirData} />
        </div>
        {/* main section ends here */}
        {process.env.REACT_APP_ENV === "LOCAL_DEV" && (
          <ReactQueryDevtools initialIsOpen={false} />
        )}
      </div>
      <Switch>
        <Route
          path={[`${path}/createFolder`]}
          render={() => (
            <FoldersDirectoryCreationScreen onClose={() => history.goBack()} />
          )}
        />
        <Route
          path={[`${path}/createPage`, `${path}/editPageSettings/:fileName`]}
          render={() => (
            <FoldersPageSettingsScreen onClose={() => history.goBack()} />
          )}
        />
        <Route
          path={[
            `${path}/deletePage/:fileName`,
            `${path}/deleteSubfolder/:subCollectionName`,
          ]}
          render={() => (
            <FoldersDeleteWarningScreen onClose={() => history.goBack()} />
          )}
        />
        <Route
          path={[`${path}/rearrange`]}
          render={() => (
            <FoldersReorderingScreen onClose={() => history.goBack()} />
          )}
        />
        <Route
          path={[`${path}/editSubfolderSettings/:subCollectionName`]}
          render={() => (
            <FoldersDirectorySettingsScreen onClose={() => history.goBack()} />
          )}
        />
        <Route
          path={[`${path}/movePage/:fileName`]}
          render={() => (
            <FoldersPageMoveScreen onClose={() => history.goBack()} />
          )}
        />
      </Switch>
    </>
  )
}

export default Folders

Folders.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      siteName: PropTypes.string,
    }),
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
}
