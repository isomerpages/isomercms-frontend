import axios from "axios"
import * as _ from "lodash"
import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"
import { useFieldArray, useForm, FormProvider } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"

import FolderCard from "components/FolderCard"
import LoadingButton from "components/LoadingButton"
import {
  DirectorySettingsSchema,
  DirectorySettingsModal,
} from "components/DirectorySettingsModal"

import elementStyles from "styles/isomer-cms/Elements.module.scss"
import adminStyles from "styles/isomer-cms/pages/Admin.module.scss"
import contentStyles from "styles/isomer-cms/pages/Content.module.scss"

// axios settings
axios.defaults.withCredentials = true

const DirectoryCreationModal = ({ params, onClose, dirData, onProceed }) => {
  const { siteName, collectionName } = params
  const [pagesData, setPagesData] = useState([])

  const [isSelectingTitle, setIsSelectingTitle] = useState(true)

  const existingTitlesArray = dirData
    .filter((item) => item.type === "dir")
    .map((item) => item.name)

  const methods = useForm({
    mode: "onBlur",
    resolver: yupResolver(DirectorySettingsSchema(existingTitlesArray)),
  })

  const { fields, append, remove } = useFieldArray({
    name: "selectedPages",
    control: methods.control,
  })
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
    <FormProvider {...methods}>
      {isSelectingTitle && (
        <DirectorySettingsModal
          params={params}
          dirData={dirData}
          onProceed={() => setIsSelectingTitle(false)}
          onClose={onClose}
        />
      )}
      {!isSelectingTitle && (
        <div className={elementStyles.overlay}>
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
                >{`Select pages to add into '${methods.watch(
                  "newDirectoryName"
                )}'`}</h1>
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
                            fields.findIndex(
                              (item) => item.name === pageData.name
                            ) != -1
                              ? fields.findIndex(
                                  (item) => item.name === pageData.name
                                ) + 1
                              : null
                          }
                          onClick={() => {
                            const indexOfItem = fields.findIndex(
                              (item) => item.name === pageData.name
                            )
                            indexOfItem != -1
                              ? remove(indexOfItem)
                              : append(pageData)
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
                label={fields.length === 0 ? `Skip` : `Done`}
                disabledStyle={elementStyles.disabled}
                className={elementStyles.blue}
                callback={() =>
                  onProceed({
                    newDirectoryName: methods.watch("newDirectoryName"),
                    items: fields.map((field) => (({ id, ...p }) => p)(field)),
                  })
                }
              />
            </div>
          </div>
        </div>
      )}
    </FormProvider>
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
