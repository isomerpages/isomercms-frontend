import React, { useState, useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import axios from 'axios';
import PropTypes from 'prop-types';
import * as _ from 'lodash';

import FormField from './FormField';
import FormFieldHorizontal from './FormFieldHorizontal';
import ResourceFormFields from './ResourceFormFields';
import SaveDeleteButtons from './SaveDeleteButtons';
import { RESOURCE_ROOM_NAME_KEY, RESOURCE_CATEGORY_CONTENT_KEY } from '../constants'

import useSiteUrlHook from '../hooks/useSiteUrlHook';
import useRedirectHook from '../hooks/useRedirectHook';

import {
  DEFAULT_RETRY_MSG,
  frontMatterParser,
  generateResourceFileName,
  retrieveResourceFileMetadata,
  concatFrontMatterMdBody,
  deslugifyDirectory,
  slugifyCategory,
} from '../utils';

import { createPageData, updatePageData, renamePageData, getResourceRoomName } from '../api'

import { validateResourceSettings } from '../utils/validators';
import { errorToast, successToast } from '../utils/toasts';

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
    // Instantiate queryClient
    const queryClient = useQueryClient()

    const { setRedirectToPage } = useRedirectHook()
    const { retrieveSiteUrl } = useSiteUrlHook()

    // Errors
    const [errors, setErrors] = useState({
        title: '',
        permalink: '',
        fileUrl: '',
        resourceDate: '',
    })
    const [hasErrors, setHasErrors] = useState(false)
    const [hasChanges, setHasChanges] = useState(false)

    // Base hooks
    const [title, setTitle] = useState('')
    const [permalink, setPermalink] = useState('')
    const [mdBody, setMdBody] = useState('')
    const [sha, setSha] = useState('')
    const [isPost, setIsPost] = useState(true)

    // Track original values
    const [originalTitle, setOriginalTitle] = useState('')
    const [originalPermalink, setOriginalPermalink] = useState('')
    const [originalFileUrl, setOriginalFileUrl] = useState('')
    const [originalFrontMatter, setOriginalFrontMatter] = useState({})
    const [originalResourceDate, setOriginalResourceDate] = useState()

    // Resource-related
    const [resourceDate, setResourceDate] = useState('')
    const [fileUrl, setFileUrl] = useState('')

    const [siteUrl, setSiteUrl] = useState('https://abc.com.sg')

    // Map element ID to setter functions
    const idToSetterFuncMap = {
        title: setTitle,
        permalink: setPermalink,
        date: setResourceDate,
        fileUrl: setFileUrl,
    }

    const { data: resourceRoomName } = useQuery(
      [RESOURCE_ROOM_NAME_KEY, siteName],
      () => getResourceRoomName(siteName),
      {
        retry: false,
        onError: () => {
          errorToast(`The resource room name could not be retrieved. ${DEFAULT_RETRY_MSG}`)
        }
      },
    )

    useEffect(() => {
      let _isMounted = true

      if (!resourceRoomName) return

      const initializePageDetails = () => {
        if (pageData !== undefined) { // is existing page
          const { pageContent, pageSha } = pageData
          const { frontMatter, mdBody: pageMdBody } = frontMatterParser(pageContent)
          const { title: originalTitle, file_url: originalFileUrl, permalink: originalPermalink } = frontMatter
          const { type: originalType, date: originalDate } = retrieveResourceFileMetadata(fileName)
          if (_isMounted) {
            setSha(pageSha)
            setMdBody(pageMdBody)
            setIsPost(originalType === 'post')

            // Front matter properties
            setOriginalTitle(originalTitle)
            setTitle(originalTitle)

            setPermalink(originalPermalink)
            setOriginalPermalink(originalPermalink)
            setFileUrl(originalFileUrl)
            setOriginalFileUrl(originalFileUrl)
            setOriginalFrontMatter(originalFrontMatter)

            setOriginalResourceDate(originalDate)
            setResourceDate(originalDate)
          }
        }
        if (isNewFile) {
          const exampleDate = new Date().toISOString().split("T")[0]
          const examplePermalink = `/${resourceRoomName}/${category}/permalink`
          let exampleTitle = 'Example Title'
          while (pageFileNames.map(fileName => slugifyCategory(retrieveResourceFileMetadata(fileName).title)).includes(slugifyCategory(exampleTitle))) {
            exampleTitle = exampleTitle+'_1'
          }
          if (_isMounted) {
            setTitle(exampleTitle)
            setPermalink(examplePermalink)
            setResourceDate(exampleDate)
          } 
        }
      }

      const loadSiteUrl = async () => {
        if (siteName) {
          const retrievedSiteUrl = await retrieveSiteUrl(siteName, 'site')
          if (_isMounted) setSiteUrl(retrievedSiteUrl)
        }
      }
  
      loadSiteUrl()
      initializePageDetails()
      return () => {
        _isMounted = false
      }
    }, [pageData, resourceRoomName])

    useEffect(() => {
        setHasErrors(!isPost ? (_.some(errors, (field) => field.length > 0) || !fileUrl ) : _.some(errors, (field) => field.length > 0) );
    }, [errors])

    useEffect(() => {
      setHasChanges(!(title === originalTitle && permalink === originalPermalink && fileUrl === originalFileUrl && resourceDate === originalResourceDate))
    }, [title, permalink, fileUrl, resourceDate])

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
          ? { ...originalFrontMatter, title, date: resourceDate, permalink, layout: 'post' }
          : { ...originalFrontMatter, title, date: resourceDate, file_url: fileUrl }
        const newFileName = generateResourceFileName(title, resourceDate, isPost)
        const newPageData = concatFrontMatterMdBody(frontMatter, mdBody)
        if (isNewFile) return createPageData({ siteName, resourceName: category, newFileName }, newPageData) 
        if (fileName !== newFileName) return renamePageData({ siteName, resourceName: category, fileName, newFileName }, newPageData, sha)
        return updatePageData({ siteName, resourceName: category, fileName }, newPageData, sha)
      },
      { 
        onSettled: () => {setSelectedFile(''); setIsComponentSettingsActive(false)},
        onSuccess: (redirectUrl) => { 
          queryClient.invalidateQueries([RESOURCE_CATEGORY_CONTENT_KEY, siteName, category, true])
          if (redirectUrl && isPost) setRedirectToPage(redirectUrl)
          else successToast(`Successfully updated file settings!`)
        },
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
                <h1>{ isNewFile  ? 'Create new resource page' : 'Resource settings' }</h1>
                <button id="settings-CLOSE" type="button" onClick={() => {setSelectedFile(''); setIsComponentSettingsActive(false)}}>
                  <i id="settingsIcon-CLOSE" className="bx bx-x" />
                </button>
              </div>
              <div className={elementStyles.modalContent}>
                <div className={elementStyles.modalFormFields}>
                  { isNewFile ? 'You may edit page details anytime. ' : ''}
                  To edit page content, simply click on the page title. <br/>
                  <span className={elementStyles.infoGrey}> 
                    Resources > { deslugifyDirectory(category) } > <u className='ml-1'>{ title }</u><br/><br/>
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
                    title={siteUrl}             
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
                  isDisabled={isNewFile ? hasErrors : (!hasChanges || hasErrors || !sha)}
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
    setSelectedFile: PropTypes.func.isRequired,
    setIsComponentSettingsActive: PropTypes.func.isRequired,
    pageData: PropTypes.shape({
      pageContent: PropTypes.string.isRequired,
      pageSha: PropTypes.string.isRequired,
    }),
    pageFileNames: PropTypes.arrayOf(PropTypes.string),
  };