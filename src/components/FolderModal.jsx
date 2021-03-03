import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import SaveDeleteButtons from './SaveDeleteButtons';
import FormField from './FormField';

import {
  DEFAULT_RETRY_MSG,
} from '../utils'
import { errorToast } from '../utils/toasts';

// axios settings
axios.defaults.withCredentials = true

const FolderModal = ({ displayTitle, displayText, onClose, category, siteName, isCollection }) => {
  const [newCategoryName, setNewCategoryName] = useState(category)

  const folderNameChangeHandler = (event) => {
    const { value } = event.target
    setNewCategoryName(value)
  }

  const saveHandler = async () => {
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/${isCollection ? 'collections' : 'resources'}/${category}/rename/${newCategoryName}`)
      // Refresh page
      window.location.reload();
    } catch (err) {
      errorToast(`There was a problem trying to rename this folder. ${DEFAULT_RETRY_MSG}`)
      console.log(err);
    }
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
            saveCallback={saveHandler}
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
  isCollection: PropTypes.bool,
};

export default FolderModal;
