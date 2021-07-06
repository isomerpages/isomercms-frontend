import React from "react"

// Import contexts
import { CollectionConsumer } from "../../contexts/CollectionContext"

// Import components
import FolderNamingModal from "../folders/FolderNamingModal"
import FolderCreationPageSelectionModal from "../folders/FolderCreationPageSelectionModal"

// Import constants
import { CollectionCreationSteps } from "../../constants"

// Styles
import elementStyles from "../../styles/isomer-cms/Elements.module.scss"

const sortFuncs = {
  title: (a, b) => {
    return a.fileName.localeCompare(b.fileName)
  },
}

const getSortedCollectionPages = (collectionFolderOrderArray) => {
  const collectionPages = collectionFolderOrderArray.filter(
    (item) => item.type === "file"
  )
  const sortedCollectionPages = collectionPages.concat().sort(sortFuncs.title)
  return sortedCollectionPages
}

const CollectionCreationModal = () => {
  return (
    <CollectionConsumer>
      {({
        siteName,
        collectionName,
        collectionFolderOrderArray,
        collectionFolderCreationState,
        setCollectionFolderCreationState,
        collectionFolderCreationTitle,
        collectionFolderCreationErrors,
        collectionFolderCreationNameChangeHandler,
        collectionFolderCreationPageSelectChangeHandler,
        collectionFolderMovePages,
        createNewCollectionFolderApiCall,
      }) => (
        <>
          {collectionFolderCreationState ===
          CollectionCreationSteps.SELECT_FOLDER_NAME ? (
            <div className={elementStyles.overlay}>
              <FolderNamingModal
                onClose={() =>
                  setCollectionFolderCreationState(
                    CollectionCreationSteps.INACTIVE
                  )
                }
                onProceed={() =>
                  setCollectionFolderCreationState(
                    CollectionCreationSteps.SELECT_PAGES
                  )
                }
                folderNameChangeHandler={
                  collectionFolderCreationNameChangeHandler
                }
                title={collectionFolderCreationTitle}
                errors={collectionFolderCreationErrors}
                folderType={collectionName ? "subfolder" : "folder"} // If current folder has collectionName, it will create a collection subfolder
                proceedText="Select pages"
              />
            </div>
          ) : collectionFolderCreationState ===
            CollectionCreationSteps.SELECT_PAGES ? (
            <div className={elementStyles.overlay}>
              <FolderCreationPageSelectionModal
                siteName={siteName}
                title={collectionFolderCreationTitle}
                onClose={() =>
                  setCollectionFolderCreationState(
                    CollectionCreationSteps.INACTIVE
                  )
                }
                onProceed={createNewCollectionFolderApiCall}
                selectedPages={collectionFolderMovePages}
                sortedCollectionPages={getSortedCollectionPages(
                  collectionFolderOrderArray
                )} // sort by title
                fileSelectChangeHandler={
                  collectionFolderCreationPageSelectChangeHandler
                }
              />
            </div>
          ) : null}
        </>
      )}
    </CollectionConsumer>
  )
}

export default CollectionCreationModal
