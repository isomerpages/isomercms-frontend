import React from "react"

// Import contexts
import { CollectionConsumer } from "../../contexts/CollectionContext"

import PageSettingsModal from "../PageSettingsModal"

// Settings modal for collection page
const CollectionPageSettingsModal = () => {
  return (
    <CollectionConsumer>
      {({
        siteName,
        collectionName,
        subcollectionName,
        collectionFolderOrderArray,
        isPageSettingsActive,
        setIsPageSettingsActive,
        selectedPage,
        setSelectedPage,
        pageData,
      }) => (
        <>
          {isPageSettingsActive && (!selectedPage || pageData) && (
            <PageSettingsModal
              folderName={collectionName}
              subfolderName={subcollectionName}
              pagesData={collectionFolderOrderArray
                .filter((item) => item.type === "file")
                .map((page) => page.fileName)}
              pageData={pageData}
              siteName={siteName}
              originalPageName={selectedPage || ""}
              isNewPage={!selectedPage}
              setIsPageSettingsActive={setIsPageSettingsActive}
              setSelectedPage={setSelectedPage}
            />
          )}
        </>
      )}
    </CollectionConsumer>
  )
}

export default CollectionPageSettingsModal
