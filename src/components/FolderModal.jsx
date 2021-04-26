import React, { useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { useMutation, useQueryClient } from 'react-query';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import SaveDeleteButtons from './SaveDeleteButtons';
import FormField from './FormField';

import {
  renameFolder,
  renameSubfolder,
  renameResourceCategory,
  renameMediaSubfolder,
} from '../api'

import {
  DEFAULT_RETRY_MSG,
  slugifyCategory,
  deslugifyDirectory,
} from '../utils'

import { validateCategoryName } from '../utils/validators'
import { errorToast, successToast } from '../utils/toasts';
import { DIR_CONTENT_KEY, FOLDERS_CONTENT_KEY, RESOURCE_ROOM_CONTENT_KEY } from '../constants';

// axios settings
axios.defaults.withCredentials = true

const selectRenameApiCall = (folderType, siteName, folderOrCategoryName, subfolderName, newDirectoryName, mediaCustomPath) => {
  if (slugifyCategory(newDirectoryName) === subfolderName || slugifyCategory(newDirectoryName) === folderOrCategoryName ) return
  if (folderType === 'page' && !subfolderName) {
    const params = {
      siteName,
      folderName: folderOrCategoryName,
      newFolderName: slugifyCategory(newDirectoryName),
    }
    return renameFolder(params)
  }

  if (folderType === 'page' && subfolderName) {
    const params = {
      siteName,
      folderName: folderOrCategoryName,
      subfolderName,
      newSubfolderName: slugifyCategory(newDirectoryName),
    }
    return renameSubfolder(params)
  }

  if (folderType === 'resource') {
    const params = {
      siteName,
      categoryName: folderOrCategoryName,
      newCategoryName: slugifyCategory(newDirectoryName),
    }
    return renameResourceCategory(params)
  }

  if (folderType === 'images') {
    const params = {
      siteName,
      mediaType: folderType,
      customPath: mediaCustomPath,
      subfolderName: folderOrCategoryName,
      newSubfolderName: slugifyCategory(newDirectoryName),
    }
    return renameMediaSubfolder(params)
  }
}

const FolderModal = ({ displayTitle, displayText, onClose, folderOrCategoryName, subfolderName, siteName, folderType, existingFolders, mediaCustomPath }) => {
  // Instantiate queryClient
  const queryClient = useQueryClient()
  const [newDirectoryName, setNewDirectoryName] = useState(deslugifyDirectory(subfolderName || folderOrCategoryName))
  const [errors, setErrors] = useState('')

  // rename folder/subfolder/resource category
  const { mutateAsync: renameDirectory } = useMutation(
    () => selectRenameApiCall(folderType, siteName, folderOrCategoryName, subfolderName, newDirectoryName, mediaCustomPath),
    {
      onError: () => errorToast(`There was a problem trying to rename this folder. ${DEFAULT_RETRY_MSG}`),
      onSuccess: () => {
        if (!isCollection) {
          // Resource folder
          queryClient.invalidateQueries([RESOURCE_ROOM_CONTENT_KEY, siteName])
        } else if (subfolderName) {
          // Collection subfolder
          queryClient.invalidateQueries([DIR_CONTENT_KEY, siteName, folderOrCategoryName, undefined])
        } else {
          queryClient.invalidateQueries([FOLDERS_CONTENT_KEY, { siteName, isResource: false }])
        }
        onClose()
        successToast(`Successfully renamed folder!`)
      },
    },
  )

  const folderNameChangeHandler = (event) => {
    const { value } = event.target
    const comparisonCategoryArray = subfolderName ? existingFolders.filter(name => name !== subfolderName) : existingFolders.filter(name => name !== folderOrCategoryName)
    let errorMessage = validateCategoryName(value, folderType, comparisonCategoryArray)
    setErrors(errorMessage)
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
            errorMessage={errors}
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
  folderType: PropTypes.string.isRequired,
  mediaCustomPath: PropTypes.string,
};

export default FolderModal;
