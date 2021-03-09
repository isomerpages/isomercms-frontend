import React, { useState, useEffect } from 'react';
import { useQuery, useMutation } from 'react-query';
import axios from 'axios';
import * as _ from 'lodash';
import FormField from './FormField';
import {
  DEFAULT_ERROR_TOAST_MSG,
  generatePageFileName,
  generatePageContent,
} from '../utils';

import { createPage } from '../api'

import elementStyles from '../styles/isomer-cms/Elements.module.scss';
import contentStyles from '../styles/isomer-cms/pages/Content.module.scss';

import { validatePageSettings } from '../utils/validators';
import SaveDeleteButtons from './SaveDeleteButtons';
import { toast } from 'react-toastify';
import Toast from './Toast';
import FormFieldHorizontal from './FormFieldHorizontal';

import useRedirectHook from '../hooks/useRedirectHook';

// axios settings
axios.defaults.withCredentials = true

const PageSettingsModal = ({
    pageType, 
    folderName,
    subfolderName,
    pageName,
    isNewPage,
    pagesData,
    siteName,
    setIsPageSettingsActive,
}) => {
    // Errors
    const [errors, setErrors] = useState({
        title: '',
        permalink: '',
    })
    const [hasErrors, setHasErrors] = useState(false)

    // Base hooks
    const [title, setTitle] = useState('')
    const [permalink, setPermalink] = useState('')
    const [sha, setSha] = useState('')
    const [mdBody, setMdBody] = useState('')
    const { setRedirectToPage } = useRedirectHook()

    const idToSetterFuncMap = {
      title: setTitle,
      permalink: setPermalink,
    }

    const { data } = useQuery(
      'page',
      () => console.log('getting page data'),
      { 
        enabled: !isNewPage,
        onSuccess: () => {
          setTitle(data.title)
          setPermalink(data.permalink)
          setSha(data.sha)
          setMdBody(data.mdBody)
        }, 
        onError: () => toast(
          <Toast notificationType='error' text={`The page data could not be retrieved. Please try again. ${DEFAULT_ERROR_TOAST_MSG}`}/>,
          {className: `${elementStyles.toastError} ${elementStyles.toastLong}`},
        )
      }
    )

    const { mutateAsync: saveHandler } = useMutation(
      async () => { 
        const fileInfo = { siteName, title, permalink, mdBody, folderName, subfolderName, pageType }
        const { endpointUrl, content, redirectUrl } = generatePageContent(fileInfo)
        await createPage(endpointUrl, content)
        return redirectUrl
      },
      { 
        onSettled: () => setIsPageSettingsActive(false),
        onSuccess: (redirectUrl) => setRedirectToPage(redirectUrl),  
        onError: () => toast(
          <Toast notificationType='error' text={`A new page could not be created. Please try again. ${DEFAULT_ERROR_TOAST_MSG}`}/>,
          {className: `${elementStyles.toastError} ${elementStyles.toastLong}`},
        )
      }
    )

    useEffect(() => {
      let exampleTitle = 'Example Title'
      while (_.find(pagesData, function(v) { return v.type === 'file' && generatePageFileName(exampleTitle) === (v.title || v.name) }) !== undefined) {
        exampleTitle = exampleTitle+'_1'
      }
      const examplePermalink = `/${folderName ? `${folderName}/` : ''}${subfolderName ? `${subfolderName}/` : ''}permalink`
      setTitle(exampleTitle)
      setPermalink(examplePermalink)
    }, [])

    useEffect(() => {
      setHasErrors(_.some(errors, (field) => field.length > 0));
    }, [errors])

    const changeHandler = (event) => {
      const { id, value } = event.target;
      const errorMessage = validatePageSettings(id, value, pagesData)
      setErrors((prevState) => ({
        ...prevState,
        [id]: errorMessage,
      }));
      idToSetterFuncMap[id](value);
    }

    return (
        <>
          <div className={elementStyles.overlay}>
            { (sha || isNewPage)
            && (
            <div className={elementStyles['modal-settings']}>
              <div className={elementStyles.modalHeader}>
                <h1>{ isNewPage  ? 'Create new page' : 'Page settings' }</h1>
                <button id="settings-CLOSE" type="button" onClick={() => setIsPageSettingsActive((prevState)=> !prevState)}>
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
                  isDisabled={isNewPage ? hasErrors : (hasErrors || !sha)}
                  hasDeleteButton={!isNewPage}
                  saveCallback={saveHandler}
                />
              </div>
            </div>
            )}
          </div>
        </>
    );
}

export default PageSettingsModal

PageSettingsModal.propTypes = {
};