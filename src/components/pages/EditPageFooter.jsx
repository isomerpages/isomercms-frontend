import React, { useState } from "react"
import Footer from "../Footer"
import DeleteWarningModal from "../DeleteWarningModal"

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
