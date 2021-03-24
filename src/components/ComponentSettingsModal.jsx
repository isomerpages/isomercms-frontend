import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CreatableSelect from 'react-select/creatable';
import { Base64 } from 'js-base64';
import PropTypes from 'prop-types';
import * as _ from 'lodash';

import FormField from './FormField';
import DeleteWarningModal from './DeleteWarningModal';
import ResourceFormFields from './ResourceFormFields';
import SaveDeleteButtons from './SaveDeleteButtons';

import useRedirectHook from '../hooks/useRedirectHook';

import {
  DEFAULT_RETRY_MSG,
  frontMatterParser,
  dequoteString,
  saveFileAndRetrieveUrl,
  retrieveResourceFileMetadata,
} from '../utils';
import { validateResourceSettings } from '../utils/validators';
import { errorToast } from '../utils/toasts';

import elementStyles from '../styles/isomer-cms/Elements.module.scss';

// axios settings
axios.defaults.withCredentials = true

// Global state
let thirdNavData = {}

const ComponentSettingsModal = ({
    category: originalCategory,
    fileName,
    isCategoryDisabled,
    isNewFile,
    collectionPageData,
    pageFileNames,
    siteName,
    setSelectedFile,
    setIsComponentSettingsActive,
}) => {
    const { setRedirectToPage } = useRedirectHook()
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

    // Resource-related
    const [resourceDate, setResourceDate] = useState('')
    const [fileUrl, setFileUrl] = useState('')

    // Page redirection modals
    const [canShowDeleteWarningModal, setCanShowDeleteWarningModal] = useState(false)

    // Map element ID to setter functions
    const idToSetterFuncMap = {
        category: setCategory,
        title: setTitle,
        permalink: setPermalink,
        date: setResourceDate,
        fileUrl: setFileUrl,
    }

    useEffect(() => {
      let _isMounted = true

      if (originalCategory) setCategory(originalCategory);

      const baseUrl = `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}${originalCategory ? `/resources/${originalCategory}` : ''}`
      setBaseApiUrl(baseUrl)

      const fetchData = async () => {
          // Retrieve the list of all page/resource categories for use in the dropdown options. Also sets the default category if none is specified.
          const resourcesResp = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources`);
          const { resources } = resourcesResp.data;
          if (_isMounted) setAllCategories(resources.map((category) => ({
            value: category.dirName,
            label: category.dirName,
          })))

          // Set component form values
          if (isNewFile) {
              // Set default values for new file
              if (_isMounted) {
                setTitle('Title')
                setPermalink(`${originalCategory ? `/${originalCategory}` : ''}/permalink`)
                setResourceDate(new Date().toISOString().split("T")[0])
              }

          } else {
              // Retrieve data from an existing page/resource
              const resp = await axios.get(`${baseUrl}/pages/${fileName}`);
              const { content, sha: fileSha } = resp.data;
              const base64DecodedContent = Base64.decode(content);
              const { frontMatter, mdBody } = frontMatterParser(base64DecodedContent);

              if (_isMounted) {
                // File properties
                setSha(fileSha)
                setMdBody(mdBody)
                setIsPost(!frontMatter.file_url)

                // Front matter properties
                setTitle(dequoteString(frontMatter.title))

                setPermalink(frontMatter.permalink)
                setOriginalPermalink(frontMatter.permalink)
                setFileUrl(frontMatter.file_url)
                setOriginalFileUrl(frontMatter.file_url)

                setResourceDate(retrieveResourceFileMetadata(fileName).date)
              }
          }
      }

      fetchData().catch((err) => {
        setIsComponentSettingsActive((prevState) => !prevState)
        errorToast(`There was a problem retrieving data from your repo. ${DEFAULT_RETRY_MSG}`)
        console.log(err)
      })
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
                thirdNavOptions: thirdNavData[category] ? thirdNavData[category].map((thirdNavObj) => thirdNavObj.label): null,
                // props
                originalCategory,
                collectionPageData,
                type: 'resource',
                resourceType: isPost ? 'post' : 'file',
                fileName,
                isNewFile,
                siteName,
                isNewCollection: !allCategories.map(category => category.value).includes(category)
            }

            const redirectUrl = await saveFileAndRetrieveUrl(fileInfo)

            // If editing details of existing file, refresh page
            if (!isNewFile) window.location.reload();
            else {
              // We refresh page if resource is being created from category folder
              if (!isPost && originalCategory) {
                window.location.reload();
              } else {
                setRedirectToPage(redirectUrl)
              }  
            }
                      
        } catch (err) {
            if (err?.response?.status === 409) {
                // Error due to conflict in name
                setErrors((prevState) => ({
                    ...prevState,
                    title: 'This title is already in use. Please choose a different one.',
                }));
                errorToast(`Another resource with the same name exists. Please choose a different name.`)
            } else {
              errorToast(`There was a problem saving your page settings. ${DEFAULT_RETRY_MSG}`)
            }
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
          errorToast(`There was a problem trying to delete this file. ${DEFAULT_RETRY_MSG}.`)
          console.log(err);
        }
    }

    const changeHandler = (event) => {
        const { id, value } = event.target;
        const { titleErrorMessage, errorMessage } = validateResourceSettings(id, value, title, resourceDate, isPost, pageFileNames.filter(file => file !== fileName))
        
        setErrors((prevState) => ({
            ...prevState,
            [id]: errorMessage,
            title: titleErrorMessage,
        }));
        idToSetterFuncMap[id](value);
    }

    const dropdownChangeHandler = (event) => {
        const { id, value } = event.target;
        const errorMessage = validateResourceSettings(id, value);
        setErrors((prevState) => ({
            ...prevState,
            [id]: errorMessage,
        }));
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

    return (
        <>
          <div className={elementStyles.overlay}>
            { (sha || isNewFile)
            && (
            <div className={elementStyles['modal-settings']}>
              <div className={elementStyles.modalHeader}>
                <h1>Resource Settings</h1>
                <button id="settings-CLOSE" type="button" onClick={() => {setSelectedFile(''); setIsComponentSettingsActive(false)}}>
                  <i id="settingsIcon-CLOSE" className="bx bx-x" />
                </button>
              </div>
              <div className={elementStyles.modalContent}>
                <div className={elementStyles.modalFormFields}>
                  {/* Category */}
                  <p className={elementStyles.formLabel}>
                    {isCategoryDisabled ? `Resource Category` : `Add to Resource Category`}
                    {
                      !isCategoryDisabled &&
                      <b> (required)</b>
                    }
                  </p>
                  <div className="d-flex text-nowrap">
                    <CreatableSelect
                      isClearable
                      className="w-100"
                      onChange={categoryDropdownHandler}
                      isDisabled={isCategoryDisabled}
                      placeholder={"Select a category or create a new category..."}
                      defaultValue={originalCategory ? 
                        {
                          value: originalCategory,
                          label: originalCategory || "Select a category or create a new category...",
                        }
                        : null
                      }
                      options={allCategories}
                    />
                  </div>
                  { errors.category && <span className={elementStyles.error}>{errors.category}</span> }
                  {/* Title */}
                  <FormField
                    title="Title"
                    id="title"
                    value={title}
                    errorMessage={errors.title}
                    isRequired={true}
                    onFieldChange={changeHandler}
                  />
                  {/* Permalink */}
                  <FormField
                    title="Permalink"
                    id="permalink"
                    value={permalink ? permalink : ''}
                    errorMessage={errors.permalink}
                    isRequired={true}
                    onFieldChange={changeHandler}
                    disabled={!isPost}
                    placeholder=' '
                  />
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
                </div>
                <SaveDeleteButtons 
                  isDisabled={isNewFile ? hasErrors || category==='' : (hasErrors || !sha)}
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