import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useMutation } from 'react-query';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import SaveDeleteButtons from './SaveDeleteButtons';
import FormField from './FormField';

import {
  renameFolder,
  renameResourceCategory,
} from '../api'

import {
  DEFAULT_RETRY_MSG,
} from '../utils'
import { errorToast } from '../utils/toasts';

// axios settings
axios.defaults.withCredentials = true

const selectRenameApiCall = (isCollection, siteName, categoryName, newCategoryName) => {
  if (isCollection) {
    const params = {
      siteName,
      folderName: categoryName,
      newFolderName: newCategoryName,
    }
    return renameFolder(params)
  }
  
  const params = {
    siteName,
    categoryName,
    newCategoryName,
  }
  return renameResourceCategory(params)
}

const FolderModal = ({ displayTitle, displayText, onClose, category, siteName, isCollection }) => {
  const [newCategoryName, setNewCategoryName] = useState(category)

  // rename folder/subfolder/category
  const { mutateAsync: renameDirectory } = useMutation(
    () => selectRenameApiCall(isCollection, siteName, category, newCategoryName),
    {
      onError: () => errorToast(`There was a problem trying to rename this folder. ${DEFAULT_RETRY_MSG}`),
      onSuccess: () => window.location.reload(),
    },
  )

  const folderNameChangeHandler = (event) => {
    const { value } = event.target
    setNewCategoryName(value)
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
            id="newCategoryName"
            value={newCategoryName}
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
  category: PropTypes.string.isRequired,
  siteName: PropTypes.string.isRequired,
  isCollection: PropTypes.bool.isRequired,
};

export default FolderModal;
