import React, { useEffect, useState } from 'react';

// Import contexts
import { CollectionConsumer } from '../../../contexts/CollectionContext'

// Import components
import { FolderNamingModal } from '../../FolderNamingModal'
import { FolderCreationPageSelectionModal } from '../../folders/FolderCreationPageSelectionModal'

// Import constants
import { CollectionCreationSteps } from '../../../constants'

// Styles
import elementStyles from '../styles/isomer-cms/Elements.module.scss';

const sortFuncs = {
  'title': (a, b) => {
    return a.fileName.localeCompare(b.fileName)
  }
}

const getSortedCollectionPages = (collectionFolderOrderArray) => {
  const collectionPages = collectionFolderOrderArray.filter(item => item.type === 'file')
  const sortedCollectionPages = collectionPages.concat().sort(sortFuncs['title'])
  return sortedCollectionPages
}

const CollectionCreationModal = () => {
  return (
    <CollectionConsumer>
      {({
        siteName,
        folderName,
        collectionFolderOrderArray,
        collectionFolderCreationState, 
        setCollectionFolderCreationState,
        collectionFolderCreationTitle,
        collectionFolderCreationErrors,
        collectionFolderCreationNameChangeHandler,
        createNewCollectionFolderApiCall
      }) => (
        <div className={elementStyles.overlay}>
          {
            collectionFolderCreationState === CollectionCreationSteps.SELECT_FOLDER_NAME
            ? (
                <FolderNamingModal 
                  onClose={() => setCollectionFolderCreationState(CollectionCreationSteps.INACTIVE)}
                  onProceed={() => setCollectionFolderCreationState(CollectionCreationSteps.SELECT_PAGES)}
                  folderNameChangeHandler={collectionFolderCreationNameChangeHandler}
                  title={collectionFolderCreationTitle}
                  errors={collectionFolderCreationErrors}
                  folderType={folderName ? 'subfolder' : 'folder'} // If current folder has folderName, it will create a collection subfolder
                  proceedText='Select pages'
                />
              ) 
            : collectionFolderCreationState === CollectionCreationSteps.SELECT_PAGES
            ? (
                <FolderCreationPageSelectionModal 
                  siteName={siteName}
                  title={collectionCreationTitle}
                  onClose={() => setCollectionFolderCreationState(CollectionCreationSteps.INACTIVE)}
                  onProceed={() => {
                    setCollectionFolderCreationState(CollectionCreationSteps.INACTIVE)
                    createNewCollectionFolderApiCall()
                  }}
                  sortedCollectionPages={getSortedCollectionPages(collectionFolderOrderArray)} // sort by title
                  fileSelectChangeHandler={collectionFolderCreationNameChangeHandler}
                />
              )
            : null
          }
        </div>
      )}
    </CollectionConsumer>
  )
}

export default CollectionCreationModal