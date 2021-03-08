import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import update from 'immutability-helper';
import { useMutation } from 'react-query';
import Select from 'react-select';
import { toast } from 'react-toastify';

import FolderCard from './FolderCard';
import Toast from './Toast';
import LoadingButton from '../components/LoadingButtonReactQuery';
import FolderNamingModal from './FolderNamingModal';
import useRedirectHook from '../hooks/useRedirectHook';

import { validateCategoryName } from '../utils/validators';
import { deslugifyPage, slugifyCategory, DEFAULT_ERROR_TOAST_MSG } from '../utils'

import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';
import adminStyles from '../styles/isomer-cms/pages/Admin.module.scss';
import { moveFiles } from '../api';

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
  const { setRedirectToPage } = useRedirectHook()

  const [title, setTitle] = useState('')
  const [selectedFiles, setSelectedFiles] = useState(new Set())
  //retrieve only when necessary, i.e. after user has chosen to move this page
  // const [sha, setSha] = useState('')

  const [isSelectingTitle, setIsSelectingTitle] = useState(true)
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


  const { mutate: saveHandler, isLoading, error: mutateError } = useMutation(
    () => moveFiles(siteName, [ ...selectedFiles ], slugifyCategory(title), parentFolder),
    { onSuccess: () => {
      const redirectUrl = `/sites/${siteName}/folder/${parentFolder ? `${parentFolder}/subfolder/${slugifyCategory(title)}` : slugifyCategory(title)}`
      setRedirectToPage(redirectUrl)
    }}
  )

  useEffect(() => {
    if (mutateError) {
      toast(
        <Toast notificationType='error' text={`There was a problem trying to save your nav bar. ${DEFAULT_ERROR_TOAST_MSG}`}/>, 
        {className: `${elementStyles.toastError} ${elementStyles.toastLong}`}
      );
    }
  }, [mutateError])

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
      return a.name.localeCompare(b.name)
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
          <FolderNamingModal 
            onClose={() => setIsFolderCreationActive(false)}
            onProceed={() => setIsSelectingTitle(false)}
            folderNameChangeHandler={folderNameChangeHandler}
            title={title}
            errors={errors}
          />
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
                <span className={`w-25 ${contentStyles.segment}`}>
                  <span className={elementStyles.sortLabel}>
                    {`Sort by `}
                  </span>
                  
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
                              displayText={deslugifyPage(pageData.name)}
                              settingsToggle={() => {}}
                              key={pageData.name}
                              pageType={"file"}
                              siteName={siteName}
                              itemIndex={pageIdx}
                              folderStyle={selectedFiles.has(pageData.name) ? `border border-primary` : ''}
                              onClick={() => {
                                  fileSelectChangeHandler(pageData.name)
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
                  isLoading={isLoading}
                />
              </div>
          </div>
        }
      </div>
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