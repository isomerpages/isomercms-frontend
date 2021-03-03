import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Base64 } from 'js-base64';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { Redirect } from 'react-router-dom';
import update from 'immutability-helper';
import Select from 'react-select';
import FormField from './FormField';
import FolderCard from './FolderCard';
import LoadingButton from './LoadingButton';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';
import adminStyles from '../styles/isomer-cms/pages/Admin.module.scss';
import { validateCategoryName } from '../utils/validators';
import { toast } from 'react-toastify';
import Toast from './Toast';

// axios settings
axios.defaults.withCredentials = true

const FolderCreationModal = ({
  parentFolder,
  existingSubfolders,
  pagesData,
  siteName,
  setIsFolderCreationActive,
}) => {
  // Errors
  const [errors, setErrors] = useState('')

  const [folderName, setFolderName] = useState('');
  const [title, setTitle] = useState('')
  const [selectedFiles, setSelectedFiles] = useState(new Set())
  //retrieve only when necessary, i.e. after user has chosen to move this page
  // const [sha, setSha] = useState('')

  const [isSelectingTitle, setIsSelectingTitle] = useState(true)
  // Page redirection and modals
  const [newPageUrl, setNewPageUrl] = useState('')
  const [redirectToNewPage, setRedirectToNewPage] = useState(false)
  const [sortedPagesData, setSortedPagesData] = useState(pagesData)

  const sortOptions = [
    ... parentFolder 
      ? [{
        value: 'folder',
        label: 'Original order',
      }]
      : [],
    {
      value: 'title',
      label: 'Name'
    }
  ]

  const baseApiUrl = `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}${parentFolder ? `/collections/${parentFolder}` : ''}`

  const saveHandler = async () => {
    // TODO
    console.log('saving')
  }

  const folderNameChangeHandler = (event) => {
    const { id, value } = event.target;
    let errorMessage = validateCategoryName(value, 'page')
    if (existingSubfolders.includes(value)) errorMessage = `Another folder with the same name exists. Please choose a different name.`
    setTitle(value)
    setErrors(errorMessage)
  }

  const fileSelectChangeHandler = (name) => {
    let newSelectedFiles
    if (selectedFiles.has(name)) {
      newSelectedFiles = update(selectedFiles, {
        $remove: [name]
      })
    } else {
      newSelectedFiles = update(selectedFiles, {
        $add: [name]
      })
    }
    setSelectedFiles(newSelectedFiles)
  }

  const sortFuncs = {
    'title': (a, b) => {
      return a.title.localeCompare(b.title)
    }
  }

  const sortOrderChangeHandler = (option) => {
    // Reset to original order in folder
    if (option.value === 'folder') setSortedPagesData(pagesData)
    else {
      const sortedOrder = sortedPagesData.concat().sort(sortFuncs[option.value])
      setSortedPagesData(sortedOrder)
    }
  }

  return (
    <>
      <div className={elementStyles.overlay}>
        { isSelectingTitle &&
          <div className={elementStyles['modal-newfolder']}>
            <div className={elementStyles.modalHeader}>
              <h1>{`Create new sub folder`}</h1>
              <button id="settings-CLOSE" type="button" onClick={() => setIsFolderCreationActive(false)}>
                <i id="settingsIcon-CLOSE" className="bx bx-x" />
              </button>
            </div>
            <div className={elementStyles.modalContent}>
              <div>
                
              You may edit folder name anytime. <br/>Choose the pages you would like to group.</div>
              <div className={elementStyles.modalFormFields}>
                {/* Title */}
                <FormField
                  title="Sub folder name"
                  id="subfolder"
                  value={title}
                  errorMessage={errors}
                  isRequired={true}
                  onFieldChange={folderNameChangeHandler}
                />
              </div>
              <div className={elementStyles.modalButtons}>
                <LoadingButton
                  label="Select Pages"
                  disabled={(errors || !title) ? true : false}
                  disabledStyle={elementStyles.disabled}
                  className={(errors || !title) ? elementStyles.disabled : elementStyles.blue}
                  callback={() => setIsSelectingTitle(false)}
                />
              </div>
            </div>
          </div>
        }
        { !isSelectingTitle &&
          <div className={`${elementStyles.fullscreenWrapper}`}>
            <div className={`${adminStyles.adminSidebar} ${elementStyles.wrappedContent} bg-transparent`} />
            <div className={`${contentStyles.mainSection} ${elementStyles.wrappedContent} bg-light`}>
              {/* Page title */}
              <div className={contentStyles.sectionHeader}>
                <h1 className={contentStyles.sectionTitle}>{`Select pages to add into '${title}'`}</h1>
              </div>
              <div className={`d-flex justify-content-between w-100`}>
                <span>Pages</span>
                <span className={`w-25`}>{`Sort by`}
                  <Select
                    onChange={sortOrderChangeHandler}
                    className={'w-100'}
                    defaultValue={
                      parentFolder 
                      ? {
                          value: 'folder',
                          label: 'Original order',
                        }
                      : {
                          value: 'title',
                          label: 'Name',
                        }
                    }
                    options={sortOptions}
                  />
                </span>
              </div>
              <br/>
              {/* Pages */}
              <div className={contentStyles.folderContainerBoxes}>
                <div className={contentStyles.boxesContainer}>
                  {
                    sortedPagesData && sortedPagesData.length > 0
                    ? sortedPagesData.map((pageData, pageIdx) => (
                          <FolderCard
                              displayText={pageData.title}
                              settingsToggle={() => {}}
                              key={pageData.title}
                              pageType={"file"}
                              siteName={siteName}
                              itemIndex={pageIdx}
                              folderStyle={selectedFiles.has(pageData.title) ? `border border-primary` : ''}
                              onClick={() => {
                                  fileSelectChangeHandler(pageData.title)
                              }}
                          />
                    ))
                    : (
                        !sortedPagesData
                            ? 'Loading Pages...'
                            : 'There are no pages in this folder'
                    )
                  }
                </div>
              </div>
            </div>
            <div className={contentStyles.sectionFooter}>
                <LoadingButton
                  label={`Cancel`}
                  disabledStyle={elementStyles.disabled}
                  className={`${elementStyles.warning}`}
                  callback={() => setIsFolderCreationActive(false)}
                />
                <LoadingButton
                  label={`Done`}
                  disabled={selectedFiles.size === 0}
                  disabledStyle={elementStyles.disabled}
                  className={`${selectedFiles.size === 0 ? elementStyles.disabled : elementStyles.blue}`}
                  callback={saveHandler}
                />
              </div>
          </div>
        }
      </div>
      {
        redirectToNewPage
        && (
          <Redirect
            to={{
              pathname: newPageUrl
            }}
          />
        )
      }
    </>
  );
}

export default FolderCreationModal

FolderCreationModal.propTypes = {
  parentFolder: PropTypes.string.isRequired,
  existingSubfolders: PropTypes.arrayOf(PropTypes.string).isRequired,
  // pagesData, TODO
  siteName: PropTypes.string.isRequired,
  setIsFolderCreationActive: PropTypes.func.isRequired,
};