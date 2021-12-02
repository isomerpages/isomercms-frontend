import axios from "axios"
import { FolderCard } from "components/FolderCard"
import FolderOptionButton from "components/FolderOptionButton"
import FormField from "components/FormField"
import Header from "components/Header"
import SaveDeleteButtons from "components/SaveDeleteButtons"
import Sidebar from "components/Sidebar"
import * as _ from "lodash"
import PropTypes from "prop-types"
import React from "react"
import { useForm } from "react-hook-form"
import {
  Switch,
  useRouteMatch,
  useHistory,
  Redirect,
  Route,
} from "react-router-dom"

import {
  useGetDirectoryHook,
  useCreateDirectoryHook,
} from "hooks/directoryHooks"
import { useGetResourceRoomNameHook } from "hooks/settingsHooks/useGetResourceRoomName"
import useRedirectHook from "hooks/useRedirectHook"

import {
  DirectoryCreationScreen,
  DirectorySettingsScreen,
  DeleteWarningScreen,
} from "layouts/screens"

import { ProtectedRouteWithProps } from "routing/RouteSelector"

// Import styles
import elementStyles from "styles/isomer-cms/Elements.module.scss"
import contentStyles from "styles/isomer-cms/pages/Content.module.scss"

// axios settings
axios.defaults.withCredentials = true

const EmptyResourceRoom = ({ params }) => {
  const { mutateAsync: saveHandler } = useCreateDirectoryHook({
    ...params,
    isResource: true,
  })
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()
  return (
    <>
      {/* Resource Room does not exist */}
      <div className={contentStyles.segment}>Create Resource Room</div>
      {/* Info segment */}
      <div className={contentStyles.segment}>
        <i className="bx bx-sm bx-info-circle text-dark" />
        <span>
          <strong className="ml-1">Note:</strong> You must create a Resource
          Room before you can create Resources.
        </span>
      </div>
      <FormField
        register={register}
        id="newDirectoryName"
        className="w-100"
        placeholder="Resource room title"
        errorMessage={errors.newDirectoryName?.message}
        isRequired
        maxWidth
      />
      {/* Segment divider  */}
      <div className={contentStyles.segmentDividerContainer}>
        <hr className="invisible w-100 mt-3 mb-3" />
      </div>
      <SaveDeleteButtons
        saveLabel="Create Resource Room"
        isDisabled={!_.isEmpty(errors)}
        hasDeleteButton={false}
        saveCallback={handleSubmit((data) => saveHandler(data))}
      />
    </>
  )
}

const ResourceRoom = ({ match, location }) => {
  const { params, decodedParams } = match
  const { siteName, resourceRoomName } = params
  const {
    data: queriedResourceRoomName,
    isLoading: isResourceRoomNameLoading,
  } = useGetResourceRoomNameHook({ siteName })
  const { setRedirectToPage } = useRedirectHook()

  const { path, url } = useRouteMatch()
  const history = useHistory()

  const { data: dirsData, isLoading } = useGetDirectoryHook(params, {
    enabled: !!resourceRoomName && queriedResourceRoomName === resourceRoomName,
  })

  return (
    <Route>
      {(resourceRoomName && resourceRoomName !== queriedResourceRoomName) ||
      (!resourceRoomName && queriedResourceRoomName) ? (
        <Redirect
          to={`/sites/${siteName}/resourceRoom${
            queriedResourceRoomName ? `/${queriedResourceRoomName}` : ""
          }`}
        />
      ) : (
        <>
          <Header siteName={siteName} />
          {/* main bottom section */}
          <div className={elementStyles.wrapper}>
            <Sidebar siteName={siteName} currPath={location.pathname} />
            {/* main section starts here */}
            <div className={contentStyles.mainSection}>
              {/* Page title */}
              <div className={contentStyles.sectionHeader}>
                <h1 className={contentStyles.sectionTitle}>Resources</h1>
              </div>
              {!isResourceRoomNameLoading && !resourceRoomName ? (
                <EmptyResourceRoom params={params} />
              ) : (
                <>
                  {/* Categories */}
                  <div className={contentStyles.folderContainerBoxes}>
                    <div className={contentStyles.boxesContainer}>
                      <FolderOptionButton
                        title="Create new category"
                        option="create-sub"
                        isSubfolder={false}
                        onClick={() =>
                          setRedirectToPage(`${url}/createDirectory`)
                        }
                      />
                      {isLoading ? (
                        "Loading Categories..."
                      ) : (
                        <>
                          {dirsData && dirsData.length === 0 && (
                            <>
                              No Categories.
                              <hr className="invisible w-100 mt-3 mb-3" />
                            </>
                          )}
                          {dirsData && dirsData.length > 0
                            ? dirsData.map(
                                (resourceCategory, resourceCategoryIdx) => (
                                  <FolderCard
                                    key={resourceCategory.name}
                                    pageType="resources"
                                    siteName={siteName}
                                    category={resourceCategory.name}
                                    itemIndex={resourceCategoryIdx}
                                  />
                                )
                              )
                            : null}
                        </>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
            {/* main section ends here */}
          </div>
          <Switch>
            <ProtectedRouteWithProps
              path={[`${path}/createDirectory`]}
              component={DirectoryCreationScreen}
              onClose={() => history.goBack()}
            />
            <ProtectedRouteWithProps
              path={[`${path}/deleteDirectory/:resourceCategoryName`]}
              component={DeleteWarningScreen}
              onClose={() => history.goBack()}
            />
            <ProtectedRouteWithProps
              path={[`${path}/editDirectorySettings/:resourceCategoryName`]}
              component={DirectorySettingsScreen}
              onClose={() => history.goBack()}
            />
          </Switch>
        </>
      )}
    </Route>
  )
}

export default ResourceRoom

ResourceRoom.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      siteName: PropTypes.string.isRequired,
    }),
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
}
