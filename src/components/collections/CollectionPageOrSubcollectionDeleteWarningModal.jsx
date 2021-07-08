import React from "react"

// Import contexts
import { CollectionConsumer } from "../../contexts/CollectionContext"

import DeleteWarningModal from "../DeleteWarningModal"

// Delete warning modal for both collection page deletion and subcollection deletion
const CollectionPageOrSubcollectionDeleteWarningModal = () => {
  return (
    <CollectionConsumer>
      {({
        isDeleteModalActive,
        setIsDeleteModalActive,
        deleteCollectionPageOrSubcollection,
        isSelectedItemPage,
      }) => (
        <>
          {isDeleteModalActive && (
            <DeleteWarningModal
              onCancel={() => setIsDeleteModalActive(false)}
              onDelete={deleteCollectionPageOrSubcollection}
              type={isSelectedItemPage ? "page" : "subfolder"}
            />
          )}
        </>
      )}
    </CollectionConsumer>
  )
}

export default CollectionPageOrSubcollectionDeleteWarningModal
