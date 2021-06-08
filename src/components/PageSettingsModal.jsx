import React, { useState, useEffect } from "react"
import PropTypes from "prop-types"
import { useMutation, useQueryClient } from "react-query"
import axios from "axios"
import * as _ from "lodash"

import {
  DEFAULT_RETRY_MSG,
  generatePageFileName,
  concatFrontMatterMdBody,
  frontMatterParser,
  deslugifyPage,
  deslugifyDirectory,
} from "@src/utils"

import { createPageData, updatePageData, renamePageData } from "@src/api"
import {
  PAGE_SETTINGS_KEY,
  DIR_CONTENT_KEY,
  PAGE_CONTENT_KEY,
} from "@src/constants"

import elementStyles from "@styles/isomer-cms/Elements.module.scss"

import { validatePageSettings } from "@utils/validators"
import { errorToast, successToast } from "@utils/toasts"

import FormField from "@components/FormField"
import FormFieldHorizontal from "@components/FormFieldHorizontal"
import SaveDeleteButtons from "@components/SaveDeleteButtons"

import useSiteUrlHook from "@hooks/useSiteUrlHook"
import useRedirectHook from "@hooks/useRedirectHook"

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
  // Instantiate queryClient
  const queryClient = useQueryClient()

  // Errors
  const [errors, setErrors] = useState({
    title: "",
    permalink: "",
  })
  const [hasErrors, setHasErrors] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)

  // Base hooks
  const [title, setTitle] = useState("")
  const [permalink, setPermalink] = useState("")
  const [originalPermalink, setOriginalPermalink] = useState("")
  const [originalFrontMatter, setOriginalFrontMatter] = useState({})
  const [sha, setSha] = useState("")
  const [mdBody, setMdBody] = useState("")
  const [siteUrl, setSiteUrl] = useState("https://abc.com.sg")
  const { setRedirectToPage } = useRedirectHook()
  const { retrieveSiteUrl } = useSiteUrlHook()

  const idToSetterFuncMap = {
    title: setTitle,
    permalink: setPermalink,
  }

  const { mutateAsync: saveHandler } = useMutation(
    () => {
      const frontMatter = subfolderName
        ? {
            ...originalFrontMatter,
            title,
            permalink,
            third_nav_title: deslugifyDirectory(subfolderName),
          }
        : { ...originalFrontMatter, title, permalink }
      const newPageData = concatFrontMatterMdBody(frontMatter, mdBody)
      if (isNewPage)
        return createPageData(
          {
            siteName,
            folderName,
            subfolderName,
            newFileName: generatePageFileName(title),
          },
          newPageData
        )
      if (originalPageName !== generatePageFileName(title))
        return renamePageData(
          {
            siteName,
            folderName,
            subfolderName,
            fileName: originalPageName,
            newFileName: generatePageFileName(title),
          },
          newPageData,
          sha
        )
      return updatePageData(
        { siteName, folderName, subfolderName, fileName: originalPageName },
        newPageData,
        sha
      )
    },
    {
      onSettled: () => {
        setSelectedPage("")
        setIsPageSettingsActive(false)
      },
      onSuccess: (redirectUrl) => {
        queryClient.invalidateQueries([PAGE_SETTINGS_KEY, originalPageName])
        if (redirectUrl) setRedirectToPage(redirectUrl)
        else {
          if (folderName)
            queryClient.invalidateQueries([
              DIR_CONTENT_KEY,
              siteName,
              folderName,
              subfolderName,
            ])
          else queryClient.invalidateQueries([PAGE_CONTENT_KEY, { siteName }])
          successToast(`Successfully updated page settings!`)
        }
      },
      onError: () =>
        errorToast(
          `${
            isNewPage
              ? "A new page could not be created."
              : "Your page settings could not be saved."
          } ${DEFAULT_RETRY_MSG}`
        ),
    }
  )

  useEffect(() => {
    let _isMounted = true

    const initializePageDetails = () => {
      if (pageData !== undefined) {
        // is existing page
        const { pageContent, pageSha } = pageData
        const { frontMatter, mdBody: pageMdBody } = frontMatterParser(
          pageContent
        )
        const { permalink: originalPermalink } = frontMatter

        if (_isMounted) {
          setTitle(frontMatter.title)
          setPermalink(originalPermalink)
          setOriginalPermalink(originalPermalink)
          setSha(pageSha)
          setMdBody(pageMdBody)
          setOriginalFrontMatter(frontMatter)
        }
      }
      if (isNewPage) {
        let exampleTitle = "Example Title"
        while (pagesData.includes(generatePageFileName(exampleTitle))) {
          exampleTitle = exampleTitle + "_1"
        }
        const examplePermalink = `/${folderName ? `${folderName}/` : ""}${
          subfolderName ? `${subfolderName}/` : ""
        }permalink`
        if (_isMounted) {
          setTitle(exampleTitle)
          setPermalink(examplePermalink)
        }
      }
    }

    const loadSiteUrl = async () => {
      if (siteName) {
        const retrievedSiteUrl = await retrieveSiteUrl(siteName)
        if (_isMounted && retrievedSiteUrl) setSiteUrl(retrievedSiteUrl)
      }
    }

    loadSiteUrl()
    initializePageDetails()
    return () => {
      _isMounted = false
    }
  }, [])

  useEffect(() => {
    setHasErrors(_.some(errors, (field) => field.length > 0))
  }, [errors])

  useEffect(() => {
    if (title && permalink) {
      setHasChanges(
        !isNewPage &&
          !(
            title === deslugifyPage(originalPageName) &&
            permalink === originalPermalink
          )
      )
    }
  }, [originalPageName, originalPermalink, title, permalink])

  const changeHandler = (event) => {
    const { id, value } = event.target
    const errorMessage = validatePageSettings(
      id,
      value,
      pagesData.filter((page) => page !== originalPageName)
    )

    setErrors((prevState) => ({
      ...prevState,
      [id]: errorMessage,
    }))
    idToSetterFuncMap[id](value)
  }

  return (
    <>
      {(sha || isNewPage) && (
        <div className={elementStyles.overlay}>
          <div className={elementStyles["modal-settings"]}>
            <div className={elementStyles.modalHeader}>
              <h1>{isNewPage ? "Create new page" : "Page settings"}</h1>
              <button
                id="settings-CLOSE"
                type="button"
                onClick={() => {
                  setSelectedPage("")
                  setIsPageSettingsActive((prevState) => !prevState)
                }}
              >
                <i id="settingsIcon-CLOSE" className="bx bx-x" />
              </button>
            </div>
            <div className={elementStyles.modalContent}>
              <div className={elementStyles.modalFormFields}>
                {isNewPage ? "You may edit page details anytime. " : ""}
                To edit page content, simply click on the page title. <br />
                <span className={elementStyles.infoGrey}>
                  My workspace >
                  {folderName ? (
                    <span> {deslugifyDirectory(folderName)} > </span>
                  ) : null}
                  {subfolderName ? (
                    <span> {deslugifyDirectory(subfolderName)} > </span>
                  ) : null}
                  <u className="ml-1">{title}</u>
                  <br />
                  <br />
                </span>
                {/* Title */}
                <FormField
                  title="Page title"
                  id="title"
                  value={title}
                  errorMessage={errors.title}
                  isRequired={true}
                  onFieldChange={changeHandler}
                />
                <br />
                <p className={elementStyles.formLabel}>Page URL</p>
                {/* Permalink */}
                <FormFieldHorizontal
                  title={siteUrl}
                  id="permalink"
                  value={permalink ? permalink : ""}
                  errorMessage={errors.permalink}
                  isRequired={true}
                  onFieldChange={changeHandler}
                  placeholder=" "
                />
              </div>
              <SaveDeleteButtons
                isDisabled={
                  isNewPage ? hasErrors : !hasChanges || hasErrors || !sha
                }
                hasDeleteButton={false}
                saveCallback={saveHandler}
              />
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default PageSettingsModal

PageSettingsModal.propTypes = {
  folderName: PropTypes.string,
  subfolderName: PropTypes.string,
  originalPageName: PropTypes.string,
  isNewPage: PropTypes.bool,
  pagesData: PropTypes.arrayOf(PropTypes.string),
  pageData: PropTypes.shape({
    pageContent: PropTypes.string.isRequired,
    pageSha: PropTypes.string.isRequired,
  }),
  siteName: PropTypes.string.isRequired,
  setSelectedPage: PropTypes.func.isRequired,
  setIsPageSettingsActive: PropTypes.func.isRequired,
}
