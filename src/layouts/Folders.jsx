import FolderOptionButton from "components/FolderOptionButton"
import Breadcrumb from "components/folders/Breadcrumb"
import { FolderContent } from "components/folders/FolderContent"
import Header from "components/Header"
import Sidebar from "components/Sidebar"
import _ from "lodash"
import PropTypes from "prop-types"
import React from "react"
import { ReactQueryDevtools } from "react-query/devtools"
import { Switch, useRouteMatch, useHistory } from "react-router-dom"

// Import components

import { useGetDirectoryHook } from "hooks/directoryHooks"
import useRedirectHook from "hooks/useRedirectHook"

import {
  PageSettingsScreen,
  PageMoveScreen,
  DirectoryCreationScreen,
  DirectorySettingsScreen,
  ReorderingScreen,
  DeleteWarningScreen,
} from "layouts/screens"

import { ProtectedRouteWithProps } from "routing/RouteSelector"

import elementStyles from "styles/isomer-cms/Elements.module.scss"
import contentStyles from "styles/isomer-cms/pages/Content.module.scss"

import { deslugifyDirectory, getLastItemType } from "utils"

// Import styles

const Folders = ({ match, location }) => {
  const { params, decodedParams } = match
  const { siteName, subCollectionName, collectionName } = decodedParams

  const { path, url } = useRouteMatch()
  const history = useHistory()

  const { setRedirectToPage } = useRedirectHook()

  const { data: dirData, isLoading: isLoadingDirectory } = useGetDirectoryHook(
    params
  )

  return (
    <>
      <Header params={decodedParams} />
      {/* main bottom section */}
      <div className={elementStyles.wrapper}>
        <Sidebar siteName={siteName} currPath={location.pathname} />
        {/* main section starts here */}
        <div className={contentStyles.mainSection}>
          {/* Page title */}
          <div className={contentStyles.sectionHeader}>
            <h1 className={contentStyles.sectionTitle}>
              {getLastItemType(decodedParams) === "collectionName"
                ? deslugifyDirectory(
                    decodedParams[getLastItemType(decodedParams)]
                  )
                : decodedParams[getLastItemType(decodedParams)]}
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
            <Breadcrumb params={decodedParams} isLink />
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
              onClick={() => setRedirectToPage(`${url}/createDirectory`)}
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
        <ProtectedRouteWithProps
          path={[`${path}/createDirectory`]}
          component={DirectoryCreationScreen}
          onClose={() => history.goBack()}
        />
        <ProtectedRouteWithProps
          path={[`${path}/createPage`, `${path}/editPageSettings/:fileName`]}
          component={PageSettingsScreen}
          onClose={() => history.goBack()}
        />
        <ProtectedRouteWithProps
          path={[
            `${path}/deletePage/:fileName`,
            `${path}/deleteDirectory/:subCollectionName`,
          ]}
          component={DeleteWarningScreen}
          onClose={() => history.goBack()}
        />
        <ProtectedRouteWithProps
          path={[`${path}/rearrange`]}
          component={ReorderingScreen}
          onClose={() => history.goBack()}
        />
        <ProtectedRouteWithProps
          path={[`${path}/editDirectorySettings/:subCollectionName`]}
          component={DirectorySettingsScreen}
          onClose={() => history.goBack()}
        />
        <ProtectedRouteWithProps
          path={[`${path}/movePage/:fileName`]}
          component={PageMoveScreen}
          onClose={() => history.goBack()}
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
