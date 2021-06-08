import React, { useState, useEffect } from "react"
import axios from "axios"
import PropTypes from "prop-types"
import * as _ from "lodash"
import { useQuery, useMutation } from "react-query"

// Import components
import Header from "../components/Header"
import Sidebar from "../components/Sidebar"
import FolderCard from "../components/FolderCard"
import FolderOptionButton from "../components/folders/FolderOptionButton"
import FolderNamingModal from "../components/FolderNamingModal"
import FormField from "../components/FormField"
import LoadingButton from "../components/LoadingButton"
import useRedirectHook from "../hooks/useRedirectHook"

// Import styles
import elementStyles from "../styles/isomer-cms/Elements.module.scss"
import contentStyles from "../styles/isomer-cms/pages/Content.module.scss"

// Import utils
import {
  DEFAULT_RETRY_MSG,
  deslugifyDirectory,
  slugifyCategory,
} from "../utils"
import {
  validateResourceRoomName,
  validateCategoryName,
} from "../utils/validators"
import { errorToast } from "../utils/toasts"
import { getAllResourceCategories, addResourceCategory } from "../api"
import { RESOURCE_ROOM_CONTENT_KEY } from "../constants"

// axios settings
axios.defaults.withCredentials = true

const Resources = ({ match, location }) => {
  const { siteName } = match.params

  const { setRedirectToPage } = useRedirectHook()

  const [isLoading, setIsLoading] = useState(true)
  const [resourceRoomName, setResourceRoomName] = useState()
  const [newResourceRoomName, setNewResourceRoomName] = useState("")
  const [resourceFolderNames, setResourceFolderNames] = useState([])
  const [resourceRoomNameError, setResourceRoomNameError] = useState("")
  const [isFolderCreationActive, setIsFolderCreationActive] = useState(false)
  const [newFolderName, setNewFolderName] = useState("")
  const [folderNameErrors, setFolderNameErrors] = useState("")

  const { data: resourcesResp } = useQuery(
    [RESOURCE_ROOM_CONTENT_KEY, siteName],
    () => getAllResourceCategories(siteName),
    {
      retry: false,
      onError: (err) => {
        console.log(err)
        errorToast(
          `There was a problem trying to load your categories. ${DEFAULT_RETRY_MSG}`
        )
      },
    }
  )

  const { mutateAsync: saveHandler } = useMutation(
    () => addResourceCategory(siteName, slugifyCategory(newFolderName)),
    {
      onError: () =>
        errorToast(
          `There was a problem trying to create your new category. ${DEFAULT_RETRY_MSG}`
        ),
      onSuccess: () => {
        const redirectUrl = `/sites/${siteName}/resources/${slugifyCategory(
          newFolderName
        )}`
        setRedirectToPage(redirectUrl)
      },
    }
  )

  useEffect(() => {
    let _isMounted = true
    const fetchData = async () => {
      try {
        // Get the categories in the resource room
        if (!resourcesResp) return
        const {
          resourceRoomName,
          resources: resourceCategories,
        } = resourcesResp
        if (resourceRoomName) {
          const uniqueResourceFolderNames = resourceCategories
            ? _.uniq(resourceCategories.map((file) => file.dirName))
            : []
          if (_isMounted) {
            setResourceFolderNames(uniqueResourceFolderNames)
            setResourceRoomName(resourceRoomName)
          }
        }
        if (_isMounted) setIsLoading(false)
      } catch (err) {
        if (_isMounted) setIsLoading(false)
        console.log(err)
      }
    }

    fetchData()
    return () => {
      _isMounted = false
    }
  }, [resourcesResp])

  const resourceRoomNameHandler = (event) => {
    const { value } = event.target
    const errorMessage = validateResourceRoomName(value)
    setNewResourceRoomName(value)
    setResourceRoomNameError(errorMessage)
  }

  const createResourceRoom = async () => {
    try {
      const { siteName } = match.params
      const params = { resourceRoom: newResourceRoomName }
      await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resource-room`,
        params
      )
      // Refresh page
      window.location.reload()
    } catch (err) {
      console.log(err)
    }
  }

  const folderNameChangeHandler = (event) => {
    const { value } = event.target
    const errorMessage = validateCategoryName(
      value,
      "resource",
      resourceFolderNames
    )
    setNewFolderName(value)
    setFolderNameErrors(errorMessage)
  }

  return (
    <>
      {isFolderCreationActive && (
        <div className={elementStyles.overlay}>
          <FolderNamingModal
            onClose={() => setIsFolderCreationActive(false)}
            onProceed={saveHandler}
            folderNameChangeHandler={folderNameChangeHandler}
            title={newFolderName}
            errors={folderNameErrors}
            folderType="category"
            proceedText="Save"
          />
        </div>
      )}
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
          {isLoading ? (
            "Loading Resources..."
          ) : resourceRoomName ? (
            <>
              {/* Category title */}
              <div className={contentStyles.segment}>Categories</div>
              {/* Categories */}
              <div className={contentStyles.folderContainerBoxes}>
                <div className={contentStyles.boxesContainer}>
                  {resourceFolderNames ? (
                    <>
                      {resourceFolderNames.length === 0 && (
                        <>
                          No Categories.
                          <hr className="invisible w-100 mt-3 mb-3" />
                        </>
                      )}
                      <FolderOptionButton
                        title="Create new category"
                        option="create-sub"
                        isSubfolder={false}
                        onClick={() => setIsFolderCreationActive(true)}
                      />
                      {resourceFolderNames.length > 0
                        ? resourceFolderNames.map(
                            (resourceCategory, collectionIdx) => (
                              <FolderCard
                                displayText={deslugifyDirectory(
                                  resourceCategory
                                )}
                                settingsToggle={() => {}}
                                key={resourceCategory}
                                pageType={"resources"}
                                siteName={siteName}
                                category={resourceCategory}
                                itemIndex={collectionIdx}
                                existingFolders={resourceFolderNames}
                              />
                            )
                          )
                        : null}
                    </>
                  ) : (
                    "Loading Categories..."
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              {/* Resource Room does not exist */}
              <div className={contentStyles.segment}>Create Resource Room</div>
              {/* Info segment */}
              <div className={contentStyles.segment}>
                <i className="bx bx-sm bx-info-circle text-dark" />
                <span>
                  <strong className="ml-1">Note:</strong> You must create a
                  Resource Room before you can create Resources.
                </span>
              </div>
              <FormField
                className="w-100"
                value={newResourceRoomName}
                placeholder="Resource room title"
                errorMessage={resourceRoomNameError}
                isRequired={true}
                onFieldChange={resourceRoomNameHandler}
                maxWidth={true}
              />
              {/* Segment divider  */}
              <div className={contentStyles.segmentDividerContainer}>
                <hr className="invisible w-100 mt-3 mb-3" />
              </div>
              <LoadingButton
                label="Create Resource Room"
                disabled={!!resourceRoomNameError}
                disabledStyle={elementStyles.disabled}
                className={
                  !!resourceRoomNameError
                    ? elementStyles.disabled
                    : elementStyles.blue
                }
                callback={createResourceRoom}
              />
            </>
          )}
        </div>
        {/* main section ends here */}
      </div>
    </>
  )
}

export default Resources

Resources.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      siteName: PropTypes.string.isRequired,
    }),
  }).isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired,
  }).isRequired,
}
