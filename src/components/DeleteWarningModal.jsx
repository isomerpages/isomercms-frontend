import { HStack } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import PropTypes from "prop-types"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

const DeleteWarningModal = ({ onDelete, onCancel, type }) => (
  <div className={elementStyles.overlay}>
    <div className={elementStyles["modal-warning"]}>
      <div className={elementStyles.modalHeader}>
        <h1>Delete {type}</h1>
      </div>
      <form className={elementStyles.modalContent}>
        <p>{`Are you sure you want to delete ${type || "this"}?`}</p>
        <HStack paddingTop="20px" justifyContent="flex-end" paddingInline={1}>
          <Button id="modal-delete" onClick={onDelete} colorScheme="danger">
            Delete
          </Button>
          <Button id="modal-cancel" onClick={onCancel}>
            Cancel
          </Button>
        </HStack>
      </form>
    </div>
  </div>
)

DeleteWarningModal.propTypes = {
  onDelete: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  type: PropTypes.string.isRequired,
}

export default DeleteWarningModal
