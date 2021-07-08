import React from "react"

// Import contexts
import { CollectionConsumer } from "../../contexts/CollectionContext"

import FolderModal from "../FolderModal"

// Settings modal for collection page
const CollectionFolderSettingsModal = () => {
  return (
    <CollectionConsumer>
      {({
        siteName,
        collectionName,
        collectionFolderOrderArray,
        selectedPage,
        isFolderModalOpen,
        setIsFolderModalOpen,
      }) => (
        <>
          {isFolderModalOpen && (
            <FolderModal
              displayTitle="Rename subfolder"
              displayText="Subfolder name"
              onClose={() => setIsFolderModalOpen(false)}
              folderOrCategoryName={collectionName}
              subfolderName={selectedPage}
              siteName={siteName}
              folderType="page"
              existingFolders={collectionFolderOrderArray
                .filter((item) => item.type === "dir")
                .map((item) => item.fileName)}
            />
          )}
        </>
      )}
    </CollectionConsumer>
  )
}

export default CollectionFolderSettingsModal
