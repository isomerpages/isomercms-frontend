import React from "react"
import PropTypes from "prop-types"
import elementStyles from "../styles/isomer-cms/Elements.module.scss"
import LoadingButton from "./LoadingButton"

const DeleteWarningModal = ({ onDelete, onCancel, type }) => (
  <div className={elementStyles.overlay}>
    <div className={elementStyles["modal-warning"]}>
      <div className={elementStyles.modalHeader}>
        <h1>Delete {type}</h1>
      </div>
      <form className={elementStyles.modalContent}>
        <p>{`Are you sure you want to delete ${type || "this"}?`}</p>
        <div className={elementStyles.modalButtons}>
          <LoadingButton
            id="modal-delete"
            label="Delete"
            disabledStyle={elementStyles.disabled}
            className={elementStyles.warning}
            callback={onDelete}
          />
          <button
            id="modal-cancel"
            className={elementStyles.blue}
            type="button"
            onClick={onCancel}
          >
            Cancel
          </button>
        </div>
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
