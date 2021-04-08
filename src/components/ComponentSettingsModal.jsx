import React, { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import axios from 'axios';
import PropTypes from 'prop-types';
import * as _ from 'lodash';

import FormField from './FormField';
import FormFieldHorizontal from './FormFieldHorizontal';
import ResourceFormFields from './ResourceFormFields';
import SaveDeleteButtons from './SaveDeleteButtons';

import useRedirectHook from '../hooks/useRedirectHook';

import {
  DEFAULT_RETRY_MSG,
  frontMatterParser,
  generateResourceFileName,
  retrieveResourceFileMetadata,
  concatFrontMatterMdBody,
} from '../utils';

import { createPageData, updatePageData, renamePageData } from '../api'

import { validateResourceSettings } from '../utils/validators';
import { errorToast } from '../utils/toasts';

import elementStyles from '../styles/isomer-cms/Elements.module.scss';

// axios settings
axios.defaults.withCredentials = true

const ComponentSettingsModal = ({
    category,
    fileName,
    isNewFile,
    pageData,
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
    })
    const [hasErrors, setHasErrors] = useState(false)

    // Base hooks
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
        title: setTitle,
        permalink: setPermalink,
        date: setResourceDate,
        fileUrl: setFileUrl,
    }

    useEffect(() => {
      let _isMounted = true

      const initializePageDetails = () => {
        if (pageData !== undefined) { // is existing page
          const { pageContent, pageSha } = pageData
          const { frontMatter, pageMdBody } = frontMatterParser(pageContent)
          const { file_url: originalFileUrl, permalink: originalPermalink } = frontMatter
          const { title: originalTitle, type: originalType, date: originalDate } = retrieveResourceFileMetadata(fileName)
          if (_isMounted) {
            setSha(pageSha)
            setMdBody(pageMdBody)
            setIsPost(originalType === 'post')

            // Front matter properties
            setTitle(originalTitle)

            setPermalink(originalPermalink)
            setOriginalPermalink(originalPermalink)
            setFileUrl(originalFileUrl)
            setOriginalFileUrl(originalFileUrl)

            setResourceDate(originalDate)
          }
        }
        if (isNewFile) {
          const exampleDate = new Date().toISOString().split("T")[0]
          const examplePermalink = `/${category}/permalink`
          let exampleTitle = 'Example Title'
          while (_.find(pageFileNames, (v) => generateResourceFileName(exampleTitle, exampleDate, isPost) === v ) !== undefined) {
            exampleTitle = exampleTitle+'_1'
          }
          if (_isMounted) {
            setTitle(exampleTitle)
            setPermalink(examplePermalink)
            setResourceDate(exampleDate)
          } 
        }
      }
      initializePageDetails()
      return () => {
        _isMounted = false
      }
    }, [pageData])

    useEffect(() => {
        setHasErrors(!isPost ? (_.some(errors, (field) => field.length > 0) || !fileUrl ) : _.some(errors, (field) => field.length > 0) );
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
            setPermalink(originalPermalink ? originalPermalink : `/${category}/permalink`)
            setFileUrl('')
            setIsPost(true)
            setErrors((prevState) => ({
                ...prevState,
                fileUrl: '',
            }))
        }
    }

    const { mutateAsync: saveHandler } = useMutation(
      () => {
        const frontMatter = isPost 
          ? { title, date: resourceDate, permalink }
          : { title, date: resourceDate, file_url: fileUrl }
        const newFileName = generateResourceFileName(title, resourceDate, isPost)
        if (isNewFile) return createPageData({ siteName, resourceName: category, newFileName }, concatFrontMatterMdBody(frontMatter, mdBody)) 
        if (fileName !== newFileName) return renamePageData({ siteName, resourceName: category, fileName, newFileName }, concatFrontMatterMdBody(frontMatter, mdBody), sha)
        return updatePageData({ siteName, resourceName: category, fileName }, concatFrontMatterMdBody(frontMatter, mdBody), sha)
      },
      { 
        onSettled: () => {setSelectedFile(''); setIsComponentSettingsActive(false)},
        onSuccess: (redirectUrl) => redirectUrl && isPost ? setRedirectToPage(redirectUrl) : window.location.reload(),
        onError: () => errorToast(`${isNewFile ? 'A new resource page could not be created.' : 'Your resource page settings could not be saved.'} ${DEFAULT_RETRY_MSG}`)
      }
    )

    const changeHandler = (event) => {
        const { id, value } = event.target;
        const errorMessage = validateResourceSettings(id, value, pageFileNames.filter(file => file !== fileName))
        
        setErrors((prevState) => ({
            ...prevState,
            [id]: errorMessage,
        }));
        idToSetterFuncMap[id](value);
    }

    return (
        <>
          <div className={elementStyles.overlay}>
            { (sha || isNewFile)
            && (
            <div className={elementStyles['modal-settings']}>
              <div className={elementStyles.modalHeader}>
                <h1>{ isNewFile  ? 'Create new page' : 'Resource settings' }</h1>
                <button id="settings-CLOSE" type="button" onClick={() => {setSelectedFile(''); setIsComponentSettingsActive(false)}}>
                  <i id="settingsIcon-CLOSE" className="bx bx-x" />
                </button>
              </div>
              <div className={elementStyles.modalContent}>
                <div className={elementStyles.modalFormFields}>
                  { isNewFile ? 'You may edit page details anytime. ' : ''}
                  To edit page content, simply click on the page title. <br/>
                  <span className={elementStyles.infoGrey}> 
                    My workspace > Resources > { category } > <u className='ml-1'>{ title }</u><br/><br/>
                  </span>  
                  {/* Title */}
                  <FormField
                    title="Title"
                    id="title"
                    value={title}
                    errorMessage={errors.title}
                    isRequired={true}
                    onFieldChange={changeHandler}
                  />
                  <p className={elementStyles.formLabel}>{isPost? 'Page URL' : 'File URL'}</p>
                  {/* Permalink */}
                  <FormFieldHorizontal
                    title={`https://abc.gov.sg`}             
                    id="permalink"
                    value={isPost ? permalink : fileUrl}
                    errorMessage={errors.permalink}
                    isRequired={isPost}
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
                  isDisabled={isNewFile ? hasErrors : (hasErrors || !sha)}
                  hasDeleteButton={false}
                  saveCallback={saveHandler}
                />
              </div>
            </div>
            )}
          </div>
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