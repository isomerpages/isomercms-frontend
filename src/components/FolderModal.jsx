import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useMutation } from 'react-query';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import SaveDeleteButtons from './SaveDeleteButtons';
import FormField from './FormField';

import {
  renameFolder,
  renameSubfolder,
  renameResourcedirectory,
  renameResourceCategory,
} from '../api'

import {
  DEFAULT_RETRY_MSG,
} from '../utils'
import { errorToast } from '../utils/toasts';

// axios settings
axios.defaults.withCredentials = true

const selectRenameApiCall = (isCollection, isSubfolder, siteName, folderOrCategoryName, subfolderName, newDirectoryName) => {
  if (isCollection && !isSubfolder) {
    const params = {
      siteName,
      folderName: folderOrCategoryName,
      newFolderName: newDirectoryName,
    }
    return renameFolder(params)
  }

  if (isCollection && isSubfolder) {
    const params = {
      siteName,
      folderName: folderOrCategoryName,
      subfolderName,
      newSubfolderName: newDirectoryName,
    }
    return renameSubfolder(params)
  }

  const params = {
    siteName,
    categoryName: folderOrCategoryName,
    newCategoryName: newDirectoryName,
  }
  return renameResourceCategory(params)
}

const FolderModal = ({ displayTitle, displayText, onClose, folderOrCategoryName, subfolderName, siteName, isCollection }) => {
  const [newDirectoryName, setNewDirectoryName] = useState(subfolderName || folderOrCategoryName)

  // rename folder/subfolder/resource category
  const { mutateAsync: renameDirectory } = useMutation(
    () => selectRenameApiCall(isCollection, siteName, folderOrCategoryName, subfolderName, newDirectoryName),
    {
      onError: () => errorToast(`There was a problem trying to rename this folder. ${DEFAULT_RETRY_MSG}`),
      onSuccess: () => window.location.reload(),
    },
  )

  const folderNameChangeHandler = (event) => {
    const { value } = event.target
    setNewDirectoryName(value)
  }

  return (
    <div className={elementStyles.overlay}>
      <div className={elementStyles['modal-settings']}>
        <div className={elementStyles.modalHeader}>
          <h1>
            {displayTitle}
          </h1>
          <button type="button" onClick={onClose}>
            <i className="bx bx-x" />
          </button>
        </div>
        <form className={elementStyles.modalContent}>
          <FormField
            title={displayText}
            id="newDirectoryName"
            value={newDirectoryName}
            onFieldChange={folderNameChangeHandler}
          />
          <SaveDeleteButtons
            isDisabled={false}
            hasDeleteButton={false}
            saveCallback={renameDirectory}
          />
        </form>
      </div>
    </div>
  )
};

FolderModal.propTypes = {
  displayTitle: PropTypes.string.isRequired,
  displayText: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  folderOrCategoryName: PropTypes.string.isRequired,
  subfolderName: PropTypes.string,
  siteName: PropTypes.string.isRequired,
  isCollection: PropTypes.bool.isRequired,
};

export default FolderModal;
