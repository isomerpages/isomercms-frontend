import React, { useState, useEffect } from 'react';
import { useMutation } from 'react-query';
import axios from 'axios';
import * as _ from 'lodash';
import FormField from './FormField';
import {
  DEFAULT_RETRY_MSG,
  generatePageFileName,
  concatFrontMatterMdBody,
  frontMatterParser,
  deslugifyPage,
} from '../utils';

import { createPageData, updatePageData, renamePageData } from '../api'

import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';

import { validatePageSettings } from '../utils/validators';
import SaveDeleteButtons from './SaveDeleteButtons';
import { errorToast } from '../utils/toasts';
import FormFieldHorizontal from './FormFieldHorizontal';

import useRedirectHook from '../hooks/useRedirectHook';

// axios settings
axios.defaults.withCredentials = true

const PageSettingsModal = ({
    folderName,
    subfolderName,
    originalPageName,
    isNewPage,
    pagesData,
    pageData,
    siteName,
    setSelectedPage,
    setIsPageSettingsActive,
}) => {
    // Errors
    const [errors, setErrors] = useState({
        title: '',
        permalink: '',
    })
    const [hasErrors, setHasErrors] = useState(false)
    const [hasChanges, setHasChanges] = useState(false)

    // Base hooks
    const [title, setTitle] = useState('')
    const [permalink, setPermalink] = useState('')
    const [originalPermalink, setOriginalPermalink] = useState('')
    const [sha, setSha] = useState('')
    const [mdBody, setMdBody] = useState('')
    const { setRedirectToPage } = useRedirectHook()

    const idToSetterFuncMap = {
      title: setTitle,
      permalink: setPermalink,
    }

    const { mutateAsync: saveHandler } = useMutation(
      () => {
        const frontMatter = subfolderName 
          ? { title, permalink, third_nav_title: subfolderName }
          : { title, permalink }
        if (isNewPage) return createPageData({ siteName, folderName, subfolderName, newFileName: generatePageFileName(title) }, concatFrontMatterMdBody(frontMatter, mdBody)) 
        if (originalPageName !== generatePageFileName(title)) return renamePageData({ siteName, folderName, subfolderName, fileName: originalPageName, newFileName: generatePageFileName(title) }, concatFrontMatterMdBody(frontMatter, mdBody), sha)
        return updatePageData({ siteName, folderName, subfolderName, fileName: originalPageName }, concatFrontMatterMdBody(frontMatter, mdBody), sha)
      },
      { 
        onSettled: () => {setSelectedPage(''); setIsPageSettingsActive(false)},
        onSuccess: (redirectUrl) => redirectUrl ? setRedirectToPage(redirectUrl) : window.location.reload(),
        onError: () => errorToast(`${isNewPage ? 'A new page could not be created.' : 'Your page settings could not be saved.'} ${DEFAULT_RETRY_MSG}`)
      }
    )

    useEffect(() => {
      let _isMounted = true

      const initializePageDetails = () => {
        if (pageData !== undefined) { // is existing page
          const { pageContent, pageSha } = pageData
          const { frontMatter, pageMdBody } = frontMatterParser(pageContent)
          const { permalink: originalPermalink } = frontMatter
        
          if (_isMounted) {
            setTitle(deslugifyPage(originalPageName))
            setPermalink(originalPermalink)
            setOriginalPermalink(originalPermalink)
            setSha(pageSha)
            setMdBody(pageMdBody)
          }
        }
        if (isNewPage) {
          let exampleTitle = 'Example Title'
          while (_.find(pagesData, function(v) { return v.type === 'file' && generatePageFileName(exampleTitle) === v.name }) !== undefined) {
            exampleTitle = exampleTitle+'_1'
          }
          const examplePermalink = `/${folderName ? `${folderName}/` : ''}${subfolderName ? `${subfolderName}/` : ''}permalink`
          if (_isMounted) {
            setTitle(exampleTitle)
            setPermalink(examplePermalink)
          } 
        }
      }
      initializePageDetails()
      return () => {
        _isMounted = false
      }
    }, [])

    useEffect(() => {
      setHasErrors(_.some(errors, (field) => field.length > 0));
    }, [errors])

    useEffect(() => {
      setHasChanges(!isNewPage && !(originalPageName === generatePageFileName(title) && originalPermalink === permalink))
    }, [title, permalink])

    const changeHandler = (event) => {
      const { id, value } = event.target;
      const errorMessage = validatePageSettings(id, value, pagesData.filter(page => page.name !== originalPageName))
      setErrors((prevState) => ({
        ...prevState,
        [id]: errorMessage,
      }));
      idToSetterFuncMap[id](value);
    }

    return (
      <>
        { (sha || isNewPage) &&
          <div className={elementStyles.overlay}>
            <div className={elementStyles['modal-settings']}>
              <div className={elementStyles.modalHeader}>
                <h1>{ isNewPage  ? 'Create new page' : 'Page settings' }</h1>
                <button id="settings-CLOSE" type="button" onClick={() => {setSelectedPage(''); setIsPageSettingsActive((prevState)=> !prevState)}}>
                  <i id="settingsIcon-CLOSE" className="bx bx-x" />
                </button>
              </div>
              <div className={elementStyles.modalContent}>
                { isNewPage ? 'You may edit page details anytime. ' : ''}
                To edit page content, simply click on the page title. 
                <div className={contentStyles.segment}>
                  <span> 
                    My workspace >
                    {
                      folderName
                      ? <span> {folderName} > </span>  
                      : null
                    }
                    {
                      subfolderName
                      ? <span> {subfolderName} > </span>
                      : null
                    } 
                     <strong className="ml-1">{ title }</strong>
                  </span>
                </div>
                <div className={elementStyles.modalFormFields}>
                  {/* Title */}
                  <FormField
                    title="Page title"
                    id="title"
                    value={title}
                    errorMessage={errors.title}
                    isRequired={true}
                    onFieldChange={changeHandler}
                  />
                  <br/>
                  <p className={elementStyles.formLabel}>Page URL</p>
                  {/* Permalink */}
                  <FormFieldHorizontal
                    title={`https://abc.gov.sg`}             
                    id="permalink"
                    value={permalink ? permalink : ''}
                    errorMessage={errors.permalink}
                    isRequired={true}
                    onFieldChange={changeHandler}
                    placeholder=' '
                  />
                </div>
                <SaveDeleteButtons 
                  isDisabled={isNewPage ? hasErrors : (!hasChanges || hasErrors || !sha)}
                  hasDeleteButton={false}
                  saveCallback={saveHandler}
                />
              </div>
            </div>
          </div>
        }
      </>
    );
}

export default PageSettingsModal

PageSettingsModal.propTypes = {
};