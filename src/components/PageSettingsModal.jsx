import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import axios from "axios"
import * as _ from "lodash"

import {
  deslugifyDirectory,
  generatePageFileName,
  generateNewPageFrontMatter,
} from "../utils"

import {
  usePageHook,
  useCreatePageHook,
  useUpdatePageHook,
} from "../hooks/pageHooks"

import { useSiteUrlHook } from "../hooks/useUrlHook"

import elementStyles from "../styles/isomer-cms/Elements.module.scss"

import { validatePageSettings } from "../utils/validators"

import FormField from "./FormField"
import FormFieldHorizontal from "./FormFieldHorizontal"
import SaveDeleteButtons from "./SaveDeleteButtons"

// axios settings
axios.defaults.withCredentials = true

const defaultFrontMatter = {
  title: "",
  permalink: "",
}

const PageSettingsModal = ({ siteParams, modalParams, onClose }) => {
  const { isNewPage, pagesData } = modalParams
  // figure out if we can pass isNewPage via URL, and retrieve pagesData via react query hook instead

  // Base hooks
  const [frontMatter, setFrontMatter] = useState(
    isNewPage
      ? generateNewPageFrontMatter(siteParams, pagesData)
      : defaultFrontMatter
  )
  const [errors, setErrors] = useState(defaultFrontMatter)
  const [hasErrors, setHasErrors] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  const { data: pageData } = usePageHook(siteParams, { enabled: !isNewPage }) // disable react query if is new page
  const { data: siteUrl } = useSiteUrlHook(siteParams)
  const { mutateAsync: createPageHandler } = useCreatePageHook(siteParams, {
    onSettled: onClose,
  })
  const { mutateAsync: updatePageHandler } = useUpdatePageHook(siteParams, {
    onSettled: onClose,
  })

  const saveHandler = () => {
    if (isNewPage) {
      return createPageHandler({
        newFileName: generatePageFileName(frontMatter.title),
        frontMatter,
      })
    }
    return updatePageHandler({
      newFileName: generatePageFileName(frontMatter.title),
      frontMatter,
      pageBody: pageData.content.pageBody,
      sha: pageData.sha,
    })
  }

  useEffect(() => {
    if (pageData && !hasChanges) setFrontMatter(pageData.content.frontMatter)
  }, [pageData, hasChanges])

  useEffect(() => {
    setHasErrors(_.some(errors, (field) => field.length > 0))
  }, [errors])

  useEffect(() => {
    if (pageData) setHasChanges(frontMatter !== pageData.content.frontMatter)
  }, [frontMatter])

  const changeHandler = (event) => {
    const { id, value } = event.target
    const errorMessage = validatePageSettings(
      id,
      value,
      pagesData.filter((page) => page !== siteParams.fileName)
    )
    setErrors((prevState) => ({
      ...prevState,
      [id]: errorMessage,
    }))
    setFrontMatter((prevState) => ({
      ...prevState,
      [id]: value,
    }))
  }

  return (
    <div className={elementStyles.overlay}>
      <div className={elementStyles["modal-settings"]}>
        <div className={elementStyles.modalHeader}>
          <h1>{isNewPage ? "Create new page" : "Page settings"}</h1>
          <button id="settings-CLOSE" type="button" onClick={onClose}>
            <i id="settingsIcon-CLOSE" className="bx bx-x" />
          </button>
        </div>
        <div className={elementStyles.modalContent}>
          <div className={elementStyles.modalFormFields}>
            {isNewPage ? "You may edit page details anytime. " : ""}
            To edit page content, simply click on the page title. <br />
            <span className={elementStyles.infoGrey}>
              My workspace {">"}
              {siteParams.folderName ? (
                <span>
                  {deslugifyDirectory(siteParams.folderName)}
                  {">"}
                </span>
              ) : null}
              {siteParams.subfolderName ? (
                <span>
                  {deslugifyDirectory(siteParams.subfolderName)}
                  {">"}
                </span>
              ) : null}
              <u className="ml-1">{frontMatter.title}</u>
              <br />
              <br />
            </span>
            {/* Title */}
            <FormField
              title="Page title"
              id="title"
              value={frontMatter.title}
              errorMessage={errors.title}
              isRequired
              onFieldChange={changeHandler}
            />
            <br />
            <p className={elementStyles.formLabel}>Page URL</p>
            {/* Permalink */}
            <FormFieldHorizontal
              title={siteUrl || "https://abc.com"}
              id="permalink"
              value={frontMatter.permalink || ""}
              errorMessage={errors.permalink}
              isRequired
              onFieldChange={changeHandler}
              placeholder=" "
            />
          </div>
          <SaveDeleteButtons
            isDisabled={
              isNewPage ? hasErrors : !hasChanges || hasErrors || !pageData.sha
            }
            hasDeleteButton={false}
            saveCallback={saveHandler}
          />
        </div>
      </div>
    </div>
  )
}

export default PageSettingsModal

PageSettingsModal.propTypes = {
  siteParams: PropTypes.shape({
    collectionName: PropTypes.string,
    subCollectionName: PropTypes.string,
    siteName: PropTypes.string.isRequired,
    fileName: PropTypes.string,
  }),
  modalParams: PropTypes.shape({
    isNewPage: PropTypes.bool,
    pagesData: PropTypes.arrayOf(PropTypes.string),
  }),
  onClose: PropTypes.func.isRequired,
}
