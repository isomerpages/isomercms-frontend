import React, { useEffect, useState } from 'react';

// Components
import { FolderCard } from '../FolderCard'

// Styles
import elementStyles from '../../styles/isomer-cms/Elements.module.scss'
import adminStyles from '../../styles/isomer-cms/pages/Admin.module.scss'
import contentStyles from '../../styles/isomer-cms/pages/Content.module.scss'

const FolderCreationPageSelectionModal = ({ 
  siteName,
  title,
  onClose,
  onProceed,
  sortedCollectionPages,
  fileSelectChangeHandler
}) => {
  return (
    <div className={elementStyles.overlay}>
      <div className={`${elementStyles.fullscreenWrapper}`}>
        <div className={`${adminStyles.adminSidebar} ${elementStyles.wrappedContent} bg-transparent`} />
        <div className={`${contentStyles.mainSection} ${elementStyles.wrappedContent} bg-light`}>
          {/* Page title */}
          <div className={contentStyles.sectionHeader}>
            <h1 className={contentStyles.sectionTitle}>{`Select pages to add into '${title}'`}</h1>
          </div>
          <div className={`d-flex justify-content-between w-100`}>
            <span>Pages</span>
          </div>
          <br/>
          {/* Pages */}
          <div className={contentStyles.folderContainerBoxes}>
            <div className={contentStyles.boxesContainer}>
              {
                sortedCollectionPages && sortedCollectionPages.length > 0
                ? sortedCollectionPages.map((pageData, pageIdx) => (
                      <FolderCard
                          displayText={deslugifyPage(pageData.fileName)}
                          settingsToggle={() => {}}
                          key={pageData.fileName}
                          pageType={"file"}
                          siteName={siteName}
                          itemIndex={pageIdx}
                          selectedIndex={selectedFiles[pageData.fileName]}
                          onClick={() => {
                              fileSelectChangeHandler(pageData.fileName)
                          }}
                      />
                ))
                : (
                    !sortedCollectionPages
                        ? 'Loading Pages...'
                        : 'There are no pages in this folder.'
                )
              }
            </div>
          </div>
        </div>
        <div className={contentStyles.sectionFooter}>
            <LoadingButton
              label={`Cancel`}
              disabledStyle={elementStyles.disabled}
              className={`${elementStyles.warning}`}
              callback={onClose}
            />
            <LoadingButton
              label={selectedFiles.size === 0 ? `Skip` : `Done`}
              disabledStyle={elementStyles.disabled}
              className={elementStyles.blue}
              callback={onProceed}
            />
          </div>
      </div>
    </div>
  )
}

export default FolderCreationPageSelectionModal