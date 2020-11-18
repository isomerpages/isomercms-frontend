import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AsyncCreatableSelect from "react-select/async-creatable";
import CreatableSelect from 'react-select/creatable';
import { createFilter } from 'react-select';
import { Base64 } from 'js-base64';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { Redirect } from 'react-router-dom';
import FormField from './FormField';
import {
  frontMatterParser,
  dequoteString,
  generatePageFileName,
  generateCollectionPageFileName,
  generateResourceFileName,
  retrieveCollectionAndLinkFromPermalink,
  saveFileAndRetrieveUrl,
} from '../utils';
import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import { validatePageSettings, validateResourceSettings } from '../utils/validators';
import DeleteWarningModal from './DeleteWarningModal';
import ResourceFormFields from './ResourceFormFields';
import SaveDeleteButtons from './SaveDeleteButtons';

// Import utils
import { retrieveThirdNavOptions } from '../utils/dropdownUtils'

// axios settings
axios.defaults.withCredentials = true

// Helper functions
const generateInitialCategoryLabel = (originalCategory, isCategoryDisabled) => {
    if (originalCategory) return originalCategory
    // If category is disabled and no original category exists, it is an unlinked page
    return isCategoryDisabled ? "Unlinked Page" : "Select a category or create a new category..."
}

const generateInitialThirdNavLabel = (thirdNavTitle, originalCategory) => {
    if (thirdNavTitle) return thirdNavTitle
    if (originalCategory && !thirdNavTitle) return 'None'
    return "Select a third nav section..."
}

// Global state
let thirdNavData = {}

const ComponentSettingsModal = ({
    category: originalCategory,
    fileName,
    isCategoryDisabled,
    isNewFile,
    modalTitle,
    collectionPageData,
    pageFileNames,
    settingsToggle,
    siteName,
    type,
    loadThirdNavOptions,
}) => {
    // Errors
    const [errors, setErrors] = useState({
        title: '',
        permalink: '',
        fileUrl: '',
        resourceDate: '',
        category: '',
        originalCategory: '',
    })
    const [hasErrors, setHasErrors] = useState(false)

    // Base hooks
    const [allCategories, setAllCategories] = useState(null);
    const [category, setCategory] = useState('');
    const [baseApiUrl, setBaseApiUrl] = useState('');
    const [title, setTitle] = useState('')
    const [permalink, setPermalink] = useState('')
    const [mdBody, setMdBody] = useState('')
    const [sha, setSha] = useState('')
    const [isPost, setIsPost] = useState(true)

    // Track original values
    const [originalPermalink, setOriginalPermalink] = useState('')
    const [originalFileUrl, setOriginalFileUrl] = useState('')

    // Collections-related
    const [originalThirdNavTitle, setOriginalThirdNavTitle] = useState('') // this state is required for comparison purposes
    const [thirdNavTitle, setThirdNavTitle] = useState('')

    // Resource-related
    const [resourceDate, setResourceDate] = useState('')
    const [fileUrl, setFileUrl] = useState('')

    // Page redirection and modals
    const [newPageUrl, setNewPageUrl] = useState('')
    const [redirectToNewPage, setRedirectToNewPage] = useState(false)
    const [canShowDeleteWarningModal, setCanShowDeleteWarningModal] = useState(false)

    // Backup third nav option loader
    const backupLoadThirdNavOptions = async () => {
      if (thirdNavData[category]) {
        return new Promise((resolve) => {
            resolve(thirdNavData[category])
          });
      }

      const { thirdNavOptions } = await retrieveThirdNavOptions(siteName, category)
      thirdNavData[category] = thirdNavOptions
      return thirdNavOptions
    }

    // Map element ID to setter functions
    const idToSetterFuncMap = {
        category: setCategory,
        title: setTitle,
        permalink: setPermalink,
        thirdNavTitle: setThirdNavTitle,
        date: setResourceDate,
        fileUrl: setFileUrl,
    }

    useEffect(() => {
      let _isMounted = true

      if (originalCategory) setCategory(originalCategory);

      const baseUrl = `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}${originalCategory ? type === "resource" ? `/resources/${originalCategory}` : `/collections/${originalCategory}` : ''}`
      setBaseApiUrl(baseUrl)

      const fetchData = async () => {
          // Retrieve the list of all page/resource categories for use in the dropdown options. Also sets the default category if none is specified.
          if (type === 'resource') {
              const resourcesResp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources`);
              const { resources } = resourcesResp.data;
              if (_isMounted) setAllCategories(resources.map((category) => ({
                value: category.dirName,
                label: category.dirName,
              })))
          } else if (type === 'page') {
              const collectionsResp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections`);
              const { collections } = collectionsResp.data;
              const collectionCategories = [''].concat(collections) // allow for selection of "Unlinked Page" category
              if (_isMounted) setAllCategories(collectionCategories.map((category) => (
                  {
                    value:category,
                    label:category ? category : 'Unlinked Page'
                  }
              )))
          }

          // Set component form values
          if (isNewFile) {
              // Set default values for new file
              if (_isMounted) {
                setTitle('Title')
                setPermalink('permalink')
                if (type === 'resource') setResourceDate(new Date().toISOString().split("T")[0])
              }

          } else {
              // Retrieve data from an existing page/resource
              const resp = await axios.get(`${baseUrl}/pages/${fileName}`);
              const { content, sha: fileSha } = resp.data;
              const base64DecodedContent = Base64.decode(content);
              const { frontMatter, mdBody } = frontMatterParser(base64DecodedContent);

              let existingLink
              if (frontMatter.permalink) {
                // We want to set parts of the link by default, and only leave a portion editable by the user
                const { editableLink } = retrieveCollectionAndLinkFromPermalink(frontMatter.permalink)
                existingLink = editableLink
              }

              if (_isMounted) {
                // File properties
                setSha(fileSha)
                setMdBody(mdBody)
                setIsPost(!frontMatter.file_url)

                // Front matter properties
                setTitle(dequoteString(frontMatter.title))

                setPermalink(existingLink)
                setOriginalPermalink(existingLink)
                setFileUrl(frontMatter.file_url)
                setOriginalFileUrl(frontMatter.file_url)

                setResourceDate(frontMatter.date)
                setOriginalThirdNavTitle(frontMatter.third_nav_title)
                setThirdNavTitle(frontMatter.third_nav_title)
              }
          }
      }

      fetchData().catch((err) => console.log(err))
      return () => { _isMounted = false }
    }, [])

    useEffect(() => {
        setHasErrors(_.some(errors, (field) => field.length > 0));
    }, [errors])

    const handlePermalinkFileUrlToggle = (event) => {
        const { target: { value } } = event;
        if (value === 'file') {
            setPermalink('')
            setFileUrl(originalFileUrl ? originalFileUrl : '')
            setIsPost(false)
            setErrors((prevState) => ({
                ...prevState,
                permalink: '',
            }))
        } else {
            setPermalink(originalPermalink ? originalPermalink : 'permalink')
            setFileUrl('')
            setIsPost(true)
            setErrors((prevState) => ({
                ...prevState,
                fileUrl: '',
            }))
        }
    }

    const saveHandler = async () => {
        try {
            const fileInfo = {
                // state
                title,
                permalink,
                fileUrl,
                date: resourceDate,
                mdBody,
                sha,
                category,
                baseApiUrl,
                originalThirdNavTitle,
                thirdNavTitle,
                thirdNavOptions: thirdNavData[category] ? thirdNavData[category].map((thirdNavObj) => thirdNavObj.label): null,
                // props
                originalCategory,
                collectionPageData,
                type,
                fileName,
                isNewFile,
                siteName,
            }

            const redirectUrl = await saveFileAndRetrieveUrl(fileInfo)

            // Refresh page
            !isNewFile && window.location.reload();

            setNewPageUrl(redirectUrl)
            setRedirectToNewPage(true)
        } catch (err) {
            console.log(err);
        }
    }

    const deleteHandler = async () => {
        try {
            const params = { sha };
            await axios.delete(`${baseApiUrl}/pages/${fileName}`, {
                data: params,
            });

            // Refresh page
            window.location.reload();
        } catch (err) {
            console.log(err);
        }
    }

    const changeHandler = (event) => {
        const { id, value } = event.target;
        const currentFileName = fileName;

        const pageFileNamesExc = pageFileNames ? pageFileNames.filter((filename) => filename !== currentFileName) : null;

        let errorMessage, newFileName
        if (type === 'resource') {
            errorMessage = validateResourceSettings(id, value);
            newFileName = generateResourceFileName(id === "title" ? value : title, id==="date" ? value : resourceDate)
        } else if (type === 'page') {
            errorMessage = validatePageSettings(id, value);
            let groupIdentifier
            if (originalCategory) {
                groupIdentifier = fileName.split('-')[0]
                newFileName = generateCollectionPageFileName(value, groupIdentifier)
            } else {
                newFileName = generatePageFileName(value);
            }
        }
    
        if (errorMessage === '' && pageFileNamesExc && pageFileNamesExc.includes(newFileName)) {
            setErrors((prevState) => ({
                ...prevState,
                title: 'This title is already in use. Please choose a different one.',
            }));
            idToSetterFuncMap[id](value);
        } else {
            setErrors((prevState) => ({
                ...prevState,
                [id]: errorMessage,
            }));
            idToSetterFuncMap[id](value);
        }
    }

    const dropdownChangeHandler = (event) => {
        const { id, value } = event.target;
        idToSetterFuncMap[id](value);
    }

    const categoryDropdownHandler = (newValue) => {
        let event;
        if (!newValue) {
          // Field was cleared
          event = {
            target: {
              id: 'category',
              value: '',
            }
          }
        } else {
          const { value } = newValue
          event = {
            target: {
              id: 'category',
              value,
            }
          }
        }
        
        dropdownChangeHandler(event);
    };

    // Artificially create event from dropdown action
    const thirdNavDropdownHandler = (newValue) => {
        let event;
        if (!newValue) {
            // Field was cleared
            event = {
                target: {
                    id: 'thirdNavTitle',
                    value: '',
                },
            }
        } else {
            const { value } = newValue
            event = {
                target: {
                    id: 'thirdNavTitle',
                    value,
                },
            }
        }

        dropdownChangeHandler(event)
    }

    return (
        <>
          <div className={elementStyles.overlay}>
            { (sha || isNewFile)
            && (
            <div className={elementStyles['modal-settings']}>
              <div className={elementStyles.modalHeader}>
                <h1>{modalTitle}</h1>
                <button id="settings-CLOSE" type="button" onClick={settingsToggle}>
                  <i id="settingsIcon-CLOSE" className="bx bx-x" />
                </button>
              </div>
              <div className={elementStyles.modalContent}>
                <div className={elementStyles.modalFormFields}>
                  {/* Category */}
                  <p className={elementStyles.formLabel}>Category Folder Name</p>
                  <div className="d-flex text-nowrap">
                    <CreatableSelect
                      isClearable
                      className="w-100"
                      onChange={categoryDropdownHandler}
                      isDisabled={isCategoryDisabled}
                      defaultValue={{
                          value: originalCategory,
                          label: generateInitialCategoryLabel(originalCategory, isCategoryDisabled),
                        }}
                      options={allCategories}
                    />
                  </div>
                  <span className={elementStyles.error}>{errors.category}</span>
                  {/* Title */}
                  <FormField
                    title="Title"
                    id="title"
                    value={title}
                    errorMessage={errors.title}
                    isRequired={true}
                    onFieldChange={changeHandler}
                  />
                  {/* Third Nav */}
                  { 
                    ((type === "page" && originalCategory) || (type === 'page' && !originalCategory && category)) &&
                    <>
                        <p className={elementStyles.formLabel}>Third Nav Section</p>
                        <div className="d-flex text-nowrap">
                            <AsyncCreatableSelect
                              key={category}
                              isClearable
                              defaultOptions
                              className="w-100"
                              onChange={thirdNavDropdownHandler}
                              value={{
                                  value: thirdNavTitle,
                                  label: generateInitialThirdNavLabel(thirdNavTitle, originalCategory),
                              }}
                              // When displaying third nav from workspace, use backupLoadThirdNavOptions
                              loadOptions={(!originalCategory && category) ? backupLoadThirdNavOptions : loadThirdNavOptions}
                              filterOption={createFilter()}
                            />
                        </div>
                    </>
                  }
                  {/* Permalink */}
                  <FormField
                    title="Permalink"
                    id="permalink"
                    value={permalink ? permalink : ''}
                    errorMessage={errors.permalink}
                    isRequired={true}
                    onFieldChange={changeHandler}
                    disabled={!isPost}
                    fixedMessage={(category || originalCategory) ? `/${category || originalCategory}/${thirdNavTitle ? `${thirdNavTitle}/` : ''}` : '/'}
                    placeholder=' '
                  />
                  { type === "resource" && 
                  <ResourceFormFields 
                    date={resourceDate}
                    errors={errors}
                    changeHandler={changeHandler}
                    onToggle={handlePermalinkFileUrlToggle}
                    isPost={isPost}
                    setIsPost={setIsPost}
                    siteName={siteName}
                    fileUrl={fileUrl ? fileUrl : ''}
                  />
                  }
                </div>
                <SaveDeleteButtons 
                  isDisabled={isNewFile ? hasErrors || (type==='resource' && category==='') : (hasErrors || !sha)}
                  hasDeleteButton={!isNewFile}
                  saveCallback={saveHandler}
                  deleteCallback={() => setCanShowDeleteWarningModal(true)}
                />
              </div>
            </div>
            )}
          </div>
          {
            canShowDeleteWarningModal
            && (
              <DeleteWarningModal
                onCancel={() => setCanShowDeleteWarningModal(false)}
                onDelete={deleteHandler}
                type="resource"
              />
            )
          }
          {
            isNewFile
            && redirectToNewPage
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

export default ComponentSettingsModal

ComponentSettingsModal.propTypes = {
    siteName: PropTypes.string.isRequired,
    fileName: PropTypes.string.isRequired,
    category: PropTypes.string,
    isNewFile: PropTypes.bool.isRequired,
    settingsToggle: PropTypes.func.isRequired,
  };