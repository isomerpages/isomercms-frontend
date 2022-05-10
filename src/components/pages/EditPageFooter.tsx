import DeleteWarningModal from "components/DeleteWarningModal"
import Footer, { FooterProps } from "components/Footer"
import { useState } from "react"

interface EditPageFooterProps {
  isSaveDisabled: FooterProps["isKeyButtonDisabled"]
  deleteCallback: () => void
  saveCallback: FooterProps["keyCallback"]
  isSaving: FooterProps["keyButtonIsLoading"]
}

const EditPageFooter = ({
  isSaveDisabled,
  deleteCallback,
  saveCallback,
  isSaving,
}: EditPageFooterProps): JSX.Element => {
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
        optionalButtonText="Delete"
      />
    </>
  )
}

export default EditPageFooter
