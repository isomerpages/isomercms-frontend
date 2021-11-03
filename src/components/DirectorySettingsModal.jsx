import axios from "axios"
import PropTypes from "prop-types"
import React, { useState } from "react"

import FormField from "components/FormField"
import SaveDeleteButtons from "components/SaveDeleteButtons"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

import { validateCategoryName, validateSubfolderName } from "utils/validators"

import { getLastItemType } from "utils"

// axios settings
axios.defaults.withCredentials = true

const DirectorySettingsModal = ({ params, dirData, onProceed, onClose }) => {
  const [newDirectoryName, setNewDirectoryName] = useState(
    params[getLastItemType(params)]
  )
  const [errors, setErrors] = useState("")

  /** ******************************** */
  /*     handler functions    */
  /** ******************************** */

  const folderNameChangeHandler = (event) => {
    const { value } = event.target
    const comparisonCategoryArray = dirData
      .filter((item) => item.name !== params[getLastItemType(params)])
      .filter((item) => item.type === "dir")
      .map((item) => item.name)

    const errorMessage = params.collectionName
      ? validateSubfolderName(value, comparisonCategoryArray)
      : validateCategoryName(
          value,
          getLastItemType(params),
          comparisonCategoryArray
        )

    setErrors(errorMessage)
    setNewDirectoryName(value)
  }

  return (
    <div className={elementStyles.overlay}>
      <div className={elementStyles["modal-settings"]}>
        <div className={elementStyles.modalHeader}>
          <h1>Rename {params[getLastItemType(params)]}</h1>
          <button type="button" onClick={onClose}>
            <i className="bx bx-x" />
          </button>
        </div>
        <form className={elementStyles.modalContent}>
          <FormField
            title="Name"
            id="newDirectoryName"
            value={newDirectoryName}
            onFieldChange={folderNameChangeHandler}
            errorMessage={errors}
          />
          <SaveDeleteButtons
            isDisabled={!!errors}
            hasDeleteButton={false}
            saveCallback={() =>
              onProceed({
                newDirectoryName,
              })
            }
          />
        </form>
      </div>
    </div>
  )
}

DirectorySettingsModal.propTypes = {
  displayTitle: PropTypes.string.isRequired,
  displayText: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  folderOrCategoryName: PropTypes.string.isRequired,
  subfolderName: PropTypes.string,
  siteName: PropTypes.string.isRequired,
  folderType: PropTypes.string.isRequired,
  mediaCustomPath: PropTypes.string,
}

export default DirectorySettingsModal
