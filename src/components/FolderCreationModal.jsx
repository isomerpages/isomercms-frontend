import React, { useEffect, useState } from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import update from 'immutability-helper';
import { useMutation } from 'react-query';
import Select from 'react-select';

import FolderCard from './FolderCard';
import LoadingButton from '../components/LoadingButton';
import FolderNamingModal from './FolderNamingModal';
import { errorToast } from '../utils/toasts';
import useRedirectHook from '../hooks/useRedirectHook';

import { validateCategoryName } from '../utils/validators';
import { deslugifyPage, slugifyCategory, DEFAULT_RETRY_MSG } from '../utils'

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
  console.log(pagesData)
  // Errors
  const [errors, setErrors] = useState('')
  const { setRedirectToPage } = useRedirectHook()

  const [title, setTitle] = useState('')
  const [selectedFiles, setSelectedFiles] = useState({})
  //retrieve only when necessary, i.e. after user has chosen to move this page
  // const [sha, setSha] = useState('')

  const [isSelectingTitle, setIsSelectingTitle] = useState(true)
  const [sortedPagesData, setSortedPagesData] = useState(pagesData)

  const sortOptions = [
    {
      value: 'title',
      label: 'Name'
    }
  ]

  useEffect(() => {
    const sortedOrder = pagesData.concat().sort(sortFuncs['title'])
    setSortedPagesData(sortedOrder)
  }, [])

  const { mutateAsync: saveHandler } = useMutation(
    () => moveFiles(siteName, Object.keys(selectedFiles), slugifyCategory(title), parentFolder),
    { onSuccess: () => {
        const redirectUrl = `/sites/${siteName}/folder/${parentFolder ? `${parentFolder}/subfolder/${slugifyCategory(title)}` : slugifyCategory(title)}`
        setRedirectToPage(redirectUrl)
        setIsFolderCreationActive(false)
      },
      onError: (error) => {
        if (error.response.status === 409) {
          errorToast(`The name chosen is a protected folder name. Please choose a different name.`)
        } else {
          errorToast(`There was a problem trying to create your new folder. ${DEFAULT_RETRY_MSG}`)
        }
      }
    }
  )

  const folderNameChangeHandler = (event) => {
    const { value } = event.target;
    let errorMessage = validateCategoryName(value, 'page', existingSubfolders)
    setTitle(value)
    setErrors(errorMessage)
  }

  const fileSelectChangeHandler = (name) => {
    let newSelectedFiles
    if (name in selectedFiles) {
      newSelectedFiles = update(selectedFiles, {
        $unset: [name]
      })
      Object.keys(newSelectedFiles).forEach((fileName, idx) => newSelectedFiles = update(newSelectedFiles, {
        [fileName]: {$set: idx + 1}
      }))
    } else {
      newSelectedFiles = update(selectedFiles, {
        [name]: {$set: Object.keys(selectedFiles).length + 1}
      })
    }
    setSelectedFiles(newSelectedFiles)
  }

  const sortFuncs = {
    'title': (a, b) => {
      return a.fileName.localeCompare(b.fileName)
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
            folderType={parentFolder ? 'subfolder' : 'folder'}
            proceedText='Select pages'
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
                {/* <span className={`w-25 ${contentStyles.segment}`}>
                  <span className={elementStyles.sortLabel}>
                    {`Sort by `}
                  </span>
                  
                  <Select
                    onChange={sortOrderChangeHandler}
                    className={'w-100'}
                    defaultValue={
                      {
                        value: 'title',
                        label: 'Name',
                      }
                    }
                    options={sortOptions}
                  />
                </span> */}
              </div>
              <br/>
              {/* Pages */}
              <div className={contentStyles.folderContainerBoxes}>
                <div className={contentStyles.boxesContainer}>
                  {
                    sortedPagesData && sortedPagesData.length > 0
                    ? sortedPagesData.map((pageData, pageIdx) => (
                          <FolderCard
                              displayText={deslugifyPage(pageData.fileName)}
                              settingsToggle={() => {}}
                              key={pageData.fileName}
                              pageType={"file"}
                              siteName={siteName}
                              itemIndex={pageIdx}
                              selectedIndex={selectedFiles[pageData.fileName]}
                              onClick={() => {
                                  fileSelectChangeHandler(pageData.fileName)
                              }}
                          />
                    ))
                    : (
                        !sortedPagesData
                            ? 'Loading Pages...'
                            : 'There are no pages in this folder.'
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
                  label={selectedFiles.size === 0 ? `Skip` : `Done`}
                  disabledStyle={elementStyles.disabled}
                  className={elementStyles.blue}
                  callback={saveHandler}
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
  pagesData: PropTypes.arrayOf(
    PropTypes.shape({
      fileName: PropTypes.string.isRequired,
      path: PropTypes.string.isRequired,
      sha: PropTypes.string,
      title: PropTypes.string,
    }),
  ).isRequired,
  siteName: PropTypes.string.isRequired,
  setIsFolderCreationActive: PropTypes.func.isRequired,
};