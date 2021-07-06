import React from "react"

// Import context
import { CollectionProvider } from "../contexts/CollectionContext"

// Import components
import CollectionCreationModal from "../components/collections/CollectionCreationModal"
import CollectionFolderBody from "../components/collections/CollectionFolderBody"

const Collections = ({ match }) => {
  const { siteName, collectionName, subcollectionName } = match.params

  return (
    <CollectionProvider
      siteName={siteName}
      collectionName={collectionName}
      subcollectionName={subcollectionName}
    >
      {/* Modal to rearrange existing collection folder */}
      {/* <CollectionFolderReorderingModal /> */}

      {/* Modal to create new subcollection */}
      <CollectionCreationModal />

      {/* Modal to modify settings of a collection page in this collection */}
      {/* <CollectionPageSettingsModal /> */}

      {/* Modal to modify settings of a collection subfolder in this collection */}
      {/* <CollectionFolderSettingsModal /> */}

      {/* Render the folder components */}
      <CollectionFolderBody />
    </CollectionProvider>
  )
}

export default Collections
