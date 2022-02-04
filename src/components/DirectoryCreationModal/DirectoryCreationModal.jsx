import { yupResolver } from "@hookform/resolvers/yup"
import axios from "axios"
import {
  DirectorySettingsSchema,
  DirectorySettingsModal,
} from "components/DirectorySettingsModal"
import { FolderCard } from "components/FolderCard"
import LoadingButton from "components/LoadingButton"
import * as _ from "lodash"
import PropTypes from "prop-types"
import React, { useEffect, useState } from "react"
import { useFieldArray, useForm, FormProvider } from "react-hook-form"

import elementStyles from "styles/isomer-cms/Elements.module.scss"
import adminStyles from "styles/isomer-cms/pages/Admin.module.scss"
import contentStyles from "styles/isomer-cms/pages/Content.module.scss"

import { pageFileNameToTitle } from "utils"

// axios settings
axios.defaults.withCredentials = true

export const DirectoryCreationModal = ({
  params,
  onClose,
  dirsData,
  pagesData,
  onProceed,
  showSelectPages,
}) => {
  const { siteName, collectionName, mediaDirectoryName } = params

  const [isSelectingPages, setIsSelectingPages] = useState(false)

  const existingTitlesArray = dirsData.map((item) => item.name)

  const methods = useForm({
    mode: "onBlur",
    resolver: yupResolver(DirectorySettingsSchema(existingTitlesArray)),
    context: {
      type: mediaDirectoryName
        ? "mediaDirectoryName"
        : collectionName
        ? "subCollectionName"
        : "collectionName",
    },
  })

  const { fields, append, remove } = useFieldArray({
    name: "items",
    control: methods.control,
  })

  /** ******************************** */
  /*     handler functions    */
  /** ******************************** */

  const onSubmit = (data) => {
    return onProceed({
      items: data.items,
      newDirectoryName: mediaDirectoryName
        ? `${mediaDirectoryName}/${data.newDirectoryName}`
        : data.newDirectoryName,
    })
  }

  return (
    <FormProvider {...methods}>
      {!isSelectingPages && (
        <DirectorySettingsModal
          isCreate
          params={params}
          dirsData={dirsData}
          onProceed={
            showSelectPages
              ? () => setIsSelectingPages(true)
              : (data) => onProceed(data)
          }
          onClose={onClose}
        />
      )}
      {showSelectPages && isSelectingPages && (
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
              </div>
              <br />
              {/* Pages */}
              <div className={contentStyles.folderContainerBoxes}>
                <div className={contentStyles.boxesContainer}>
                  {pagesData && pagesData.length > 0
                    ? pagesData.map((pageData, pageIdx) => (
                        <FolderCard
                          displayText={pageFileNameToTitle(pageData.name)}
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
                              : append({ name: pageData.name, type: "file" })
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
                callback={methods.handleSubmit(onSubmit)}
              />
            </div>
          </div>
        </div>
      )}
    </FormProvider>
  )
}

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
