import React, { useEffect, useState } from "react"
import axios from "axios"
import PropTypes from "prop-types"
import * as _ from "lodash"

import FolderCard from "./FolderCard"
import LoadingButton from "./LoadingButton"
import FolderNamingModal from "./FolderNamingModal"

import { validateSubfolderName } from "../utils/validators"

import elementStyles from "../styles/isomer-cms/Elements.module.scss"
import contentStyles from "../styles/isomer-cms/pages/Content.module.scss"
import adminStyles from "../styles/isomer-cms/pages/Admin.module.scss"

// axios settings
axios.defaults.withCredentials = true

const DirectoryCreationModal = ({ params, onClose, dirData, onProceed }) => {
  const { siteName, collectionName } = params

  const [pagesData, setPagesData] = useState([])
  const [errors, setErrors] = useState("")

  const [title, setTitle] = useState("")
  const [selectedPages, setSelectedPages] = useState([])

  const [isSelectingTitle, setIsSelectingTitle] = useState(true)
  // const [sortedPagesData, setSortedPagesData] = useState(pagesData)

  // const sortOptions = [
  //   {
  //     value: "title",
  //     label: "Name",
  //   },
  // ]

  // useEffect(() => {
  //   const sortedOrder = pagesData.concat().sort(sortFuncs.title)
  //   setSortedPagesData(sortedOrder)
  // }, [])

  /** ******************************** */
  /*     useEffects to load data     */
  /** ******************************** */

  useEffect(() => {
    if (dirData) {
      setPagesData(dirData.filter((item) => item.type == "file"))
    }
  }, [dirData])

  /** ******************************** */
  /*     handler functions    */
  /** ******************************** */

  const folderNameChangeHandler = (event) => {
    const { value } = event.target
    const errorMessage = validateSubfolderName(
      value,
      "page",
      dirData.filter((item) => item.type == "dir").map((item) => item.name)
    )
    setTitle(value)
    setErrors(errorMessage)
  }

  const fileSelectChangeHandler = (selectedItem) => {
    const indexOfItem = selectedPages.findIndex(
      (item) => item.name === selectedItem.name
    )
    if (indexOfItem != -1) {
      // found
      setSelectedPages((prevState) =>
        prevState.slice(0, indexOfItem).concat(prevState.slice(indexOfItem + 1))
      )
    } else {
      setSelectedPages((prevState) => [...prevState, selectedItem])
    }
  }

  // const sortFuncs = {
  //   title: (a, b) => {
  //     return a.fileName.localeCompare(b.fileName)
  //   },
  // }

  // const sortOrderChangeHandler = (option) => {
  //   // Reset to original order in folder
  //   if (option.value === "folder") setSortedPagesData(pagesData)
  //   else {
  //     const sortedOrder = sortedPagesData.concat().sort(sortFuncs[option.value])
  //     setSortedPagesData(sortedOrder)
  //   }
  // }

  return (
    <>
      <div className={elementStyles.overlay}>
        {isSelectingTitle && (
          <FolderNamingModal
            onClose={onClose}
            onProceed={() => setIsSelectingTitle(false)}
            folderNameChangeHandler={folderNameChangeHandler}
            title={title}
            errors={errors}
            folderType={collectionName ? "subfolder" : "folder"}
            proceedText="Select pages"
          />
        )}
        {!isSelectingTitle && (
          <div className={`${elementStyles.fullscreenWrapper}`}>
            <div
              className={`${adminStyles.adminSidebar} ${elementStyles.wrappedContent} bg-transparent`}
            />
            <div
              className={`${contentStyles.mainSection} ${elementStyles.wrappedContent} bg-light`}
            >
              {/* Page title */}
              <div className={contentStyles.sectionHeader}>
                <h1
                  className={contentStyles.sectionTitle}
                >{`Select pages to add into '${title}'`}</h1>
              </div>
              <div className="d-flex justify-content-between w-100">
                <span>Pages</span>
                {/* <span className={`w-25 ${contentStyles.segment}`}>
                  <span className={elementStyles.sortLabel}>
                    {`Sort by `}
                  </span>
                  
                  <Select
                    onChange={sortOrderChangeHandler}
                    className={'w-100'}
                    defaultValue={
                      {
                        value: 'title',
                        label: 'Name',
                      }
                    }
                    options={sortOptions}
                  />
                </span> */}
              </div>
              <br />
              {/* Pages */}
              <div className={contentStyles.folderContainerBoxes}>
                <div className={contentStyles.boxesContainer}>
                  {pagesData && pagesData.length > 0
                    ? pagesData.map((pageData, pageIdx) => (
                        <FolderCard
                          displayText={pageData.name}
                          settingsToggle={() => {}}
                          key={pageData.name}
                          pageType="file"
                          siteName={siteName}
                          itemIndex={pageIdx}
                          selectedIndex={
                            selectedPages.findIndex(
                              (item) => item.name === pageData.name
                            ) != -1
                              ? selectedPages.findIndex(
                                  (item) => item.name === pageData.name
                                ) + 1
                              : null
                          }
                          onClick={() => {
                            fileSelectChangeHandler(pageData)
                          }}
                        />
                      ))
                    : !pagesData
                    ? "Loading Pages..."
                    : "There are no pages in this folder."}
                </div>
              </div>
            </div>
            <div className={contentStyles.sectionFooter}>
              <LoadingButton
                label="Cancel"
                disabledStyle={elementStyles.disabled}
                className={`${elementStyles.warning}`}
                callback={onClose}
              />
              <LoadingButton
                label={selectedPages.length === 0 ? `Skip` : `Done`}
                disabledStyle={elementStyles.disabled}
                className={elementStyles.blue}
                callback={() =>
                  onProceed({
                    newDirectoryName: title,
                    items: selectedPages,
                  })
                }
              />
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default DirectoryCreationModal

DirectoryCreationModal.propTypes = {
  parentFolder: PropTypes.string.isRequired,
  existingSubfolders: PropTypes.arrayOf(PropTypes.string).isRequired,
  pagesData: PropTypes.arrayOf(
    PropTypes.shape({
      fileName: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      sha: PropTypes.string,
      title: PropTypes.string,
    })
  ).isRequired,
  siteName: PropTypes.string.isRequired,
  setIsFolderCreationActive: PropTypes.func.isRequired,
}
