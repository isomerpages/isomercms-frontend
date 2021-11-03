import React, { useState } from "react"

import DeleteWarningModal from "components/DeleteWarningModal"
import Footer from "components/Footer"

const EditPageFooter = ({
  isSaveDisabled,
  deleteCallback,
  saveCallback,
  isSaving,
}) => {
  const [showDeleteWarning, setShowDeleteWarning] = useState(false)
  return (
    <>
      {showDeleteWarning && (
        <DeleteWarningModal
          onCancel={() => setShowDeleteWarning(false)}
          onDelete={deleteCallback}
          type="page"
        />
      )}
      <Footer
        isKeyButtonDisabled={isSaveDisabled}
        optionalCallback={() => setShowDeleteWarning(true)}
        keyCallback={saveCallback}
        keyButtonIsLoading={isSaving}
        keyButtonText="Save"
        optionalButtonText="Delete"
      />
    </>
  )
}

export default EditPageFooter
