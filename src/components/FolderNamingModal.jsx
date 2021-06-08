import React from "react"
import PropTypes from "prop-types"
import * as _ from "lodash"
import FormField from "./FormField"
import LoadingButton from "./LoadingButton"
import elementStyles from "../styles/isomer-cms/Elements.module.scss"

const FolderNamingModal = ({
  onClose,
  onProceed,
  folderNameChangeHandler,
  title,
  errors,
  folderType,
  proceedText,
}) => {
  const capitalizedFolderType =
    folderType.charAt(0).toUpperCase() + folderType.slice(1)

  return (
    <div className={elementStyles["modal-newfolder"]}>
      <div className={elementStyles.modalHeader}>
        <h1>{`Create new ${folderType}`}</h1>
        <button id="settings-CLOSE" type="button" onClick={onClose}>
          <i id="settingsIcon-CLOSE" className="bx bx-x" />
        </button>
      </div>
      <div className={elementStyles.modalContent}>
        <div>{`You may edit ${folderType} name anytime.`}</div>
        <div className={elementStyles.modalFormFields}>
          {/* Title */}
          <FormField
            title={`${capitalizedFolderType} name`}
            id={folderType}
            value={title}
            errorMessage={errors}
            isRequired={true}
            onFieldChange={folderNameChangeHandler}
          />
        </div>
        <div className={elementStyles.modalButtons}>
          <LoadingButton
            label={proceedText}
            disabled={errors || !title ? true : false}
            disabledStyle={elementStyles.disabled}
            className={
              errors || !title ? elementStyles.disabled : elementStyles.blue
            }
            callback={onProceed}
          />
        </div>
      </div>
    </div>
  )
}

export default FolderNamingModal

FolderNamingModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onProceed: PropTypes.func.isRequired,
  folderNameChangeHandler: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  errors: PropTypes.string,
}
