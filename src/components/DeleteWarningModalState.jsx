import React from "react"
import PropTypes from "prop-types"
import elementStyles from "../styles/isomer-cms/Elements.module.scss"
import LoadingButton from "./LoadingButton"
import { usePageHook, useDeletePageHook } from "../hooks/pageHooks"

const DeleteWarningModalState = ({ siteParams, onClose }) => {
  const { data: pageData } = usePageHook(siteParams)
  const { mutateAsync: deletePageHandler } = useDeletePageHook(siteParams, {
    onSettled: onClose,
  })
  return (
    <div className={elementStyles.overlay}>
      <div className={elementStyles["modal-warning"]}>
        <div className={elementStyles.modalHeader}>
          <h1>Delete page</h1>
        </div>
        <form className={elementStyles.modalContent}>
          <p>Are you sure you want to delete this?</p>
          <div className={elementStyles.modalButtons}>
            <LoadingButton
              id="modal-delete"
              label="Delete"
              disabledStyle={elementStyles.disabled}
              className={elementStyles.warning}
              callback={() =>
                deletePageHandler({
                  sha: pageData.sha,
                })
              }
              disabled={!pageData || !pageData.sha}
            />
            <button
              id="modal-cancel"
              className={elementStyles.blue}
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

DeleteWarningModalState.propTypes = {
  type: PropTypes.string.isRequired,
}

export default DeleteWarningModalState
