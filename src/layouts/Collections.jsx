import React from 'react';

// Import context
import { CollectionProvider } from '../contexts/CollectionContext'

// Import components
import { CollectionCreationModal } from '../components/collections/collection-creation/CollectionCreationModal'

const Collections = ({ match }) => {
  const { siteName, folderName, subfolderName } = match.params;

  return (
    <CollectionProvider siteName={siteName} folderName={folderName} subfolderName={subfolderName}>
      {/* Modal to rearrange existing collection folder */}
      <CollectionFolderReorderingModal />

      {/* Modal to create new collection subfolder flow */}
      <CollectionCreationModal />

      {/* Modal to modify settings of a collection page in this collection */}
      <CollectionPageSettingsModal />

      {/* Modal to modify settings of a collection subfolder in this collection */}
      <CollectionFolderSettingsModal />

      {/* Render the folder components */}
      <CollectionFolderBody />
    </CollectionProvider>
  )
}

export default Collections
