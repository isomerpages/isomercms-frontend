import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Base64 } from 'js-base64';
import PropTypes from 'prop-types';
import * as _ from 'lodash';
import { useQuery, useMutation } from 'react-query';

import FormField from './FormField';
import ResourceFormFields from './ResourceFormFields';
import SaveDeleteButtons from './SaveDeleteButtons';

import useRedirectHook from '../hooks/useRedirectHook';

import { saveResourcePage } from '../api';

import {
  DEFAULT_RETRY_MSG,
  frontMatterParser,
  dequoteString,
  generateResourceFileName,
  retrieveResourceFileMetadata,
} from '../utils';
import { validateResourceSettings } from '../utils/validators';
import { errorToast } from '../utils/toasts';

import elementStyles from '../styles/isomer-cms/Elements.module.scss';

// axios settings
axios.defaults.withCredentials = true

const ResourcePageSettingsModal = ({
    category,
    fileName,
    isNewFile,
    modalTitle,
    pageFileNames,
    settingsToggle,
    siteName,
    setIsComponentSettingsActive,
}) => {
    const { setRedirectToPage } = useRedirectHook()
    // Errors
    const [errors, setErrors] = useState({
        title: '',
        permalink: '',
        fileUrl: '',
        resourceDate: '',
    })
    const [hasErrors, setHasErrors] = useState(false)

    // Base hooks
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

    // Map element ID to setter functions
    const idToSetterFuncMap = {
        title: setTitle,
        permalink: setPermalink,
        date: setResourceDate,
        fileUrl: setFileUrl,
    }

    const { mutateAsync: saveHandler } = useMutation(
      () => saveResourcePage({
          category,
          date: resourceDate,
          fileUrl,
          mdBody,
          permalink,
          resourceType: isPost ? 'post' : 'file',
          sha,
          title,
          fileName,
          isNewFile,
          siteName,
      }),
      {
        onSuccess: (redirectUrl) => {
          // If editing details of existing file, refresh page
          if (!isNewFile) window.location.reload();
          else {
            // We refresh page if resource type is a file
            if (!isPost) {
              window.location.reload();
            } else {
              setRedirectToPage(redirectUrl)
            }  
          }
        },
        onError: (err) => {
          if (err?.response?.status === 409) {
            // Error due to conflict in name
            setErrors((prevState) => ({
                ...prevState,
                title: 'This title is already in use. Please choose a different one.',
            }))
            errorToast("Another resource with the same name exists. Please choose a different name.")
          } else {
            errorToast(`There was a problem saving your page settings. ${DEFAULT_RETRY_MSG}`)
          }
          console.log(err);
        }
      }
    )

    useEffect(() => {
      let _isMounted = true

      const baseUrl = `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/resources/${category}`

      const fetchData = async () => {
          // Set component form values
          if (isNewFile) {
              // Set default values for new file
              if (_isMounted) {
                setTitle('Title')
                setPermalink(`${category}/permalink`)
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

    const changeHandler = (event) => {
        const { id, value } = event.target;
        const currentFileName = fileName;

        const pageFileNamesExc = pageFileNames ? pageFileNames.filter((filename) => filename !== currentFileName) : null;

        const errorMessage = validateResourceSettings(id, value);
        const newFileName = generateResourceFileName(id === "title" ? value : title, id==="date" ? value : resourceDate)
    
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
                  <FormField
                    title="Resource Category"
                    id="resource-category"
                    value={category}
                    isRequired={true}
                    onFieldChange={() => {}}
                    disabled={true}
                  />
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
                  isDisabled={isNewFile ? (hasErrors || category === '') : (hasErrors || !sha)}
                  hasDeleteButton={false}
                  saveCallback={saveHandler}
                  deleteCallback={() => {}}
                />
              </div>
            </div>
            )}
          </div>
        </>
    );
}

export default ResourcePageSettingsModal

ResourcePageSettingsModal.propTypes = {
    siteName: PropTypes.string.isRequired,
    fileName: PropTypes.string.isRequired,
    category: PropTypes.string,
    isNewFile: PropTypes.bool.isRequired,
    settingsToggle: PropTypes.func.isRequired,
  };