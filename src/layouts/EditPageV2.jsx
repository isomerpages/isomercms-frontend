import React, { useEffect, useRef, useState } from "react"
import axios from "axios"
import _ from "lodash"
import PropTypes from "prop-types"
import marked from "marked"
import DOMPurify from "dompurify"
import checkCSP from "../utils/cspUtils"

import {
  useGetPageHook,
  useUpdatePageHook,
  useDeletePageHook,
} from "../hooks/pageHooks"

import { useCollectionHook } from "../hooks/collectionHooks"
import { useCspHook, useSiteColorsHook } from "../hooks/settingsHooks"
import useRedirectHook from "../hooks/useRedirectHook"

// Isomer components
import {
  prependImageSrc,
  getBackButton,
  extractMetadataFromFilename,
} from "../utils"

import { createPageStyleSheet } from "../utils/siteColorUtils"

import "../styles/isomer-template.scss"
import elementStyles from "../styles/isomer-cms/Elements.module.scss"

import Header from "../components/Header"
import MarkdownEditor from "../components/pages/MarkdownEditor"
import PagePreview from "../components/pages/PagePreview"
import EditPageFooter from "../components/pages/EditPageFooter"
import GenericWarningModal from "../components/GenericWarningModal"
// axios settings
axios.defaults.withCredentials = true

DOMPurify.setConfig({
  ADD_TAGS: ["iframe", "#comment"],
  ADD_ATTR: [
    "allow",
    "allowfullscreen",
    "frameborder",
    "scrolling",
    "marginheight",
    "marginwidth",
    "target",
  ],
})

const EditPageV2 = ({ match, history }) => {
  const { siteName } = match.params

  const [editorValue, setEditorValue] = useState("")
  const [currSha, setCurrSha] = useState("")
  const [htmlChunk, setHtmlChunk] = useState("")

  const [hasChanges, setHasChanges] = useState(false)
  const [isContentViolation, setIsContentViolation] = useState(false)
  const [isXSSViolation, setIsXSSViolation] = useState(false)
  const [showXSSWarning, setShowXSSWarning] = useState(false)
  const [showOverwriteWarning, setShowOverwriteWarning] = useState(false)

  const { setRedirectToNotFound } = useRedirectHook()

  const mdeRef = useRef()

  const { backButtonLabel, backButtonUrl } = getBackButton(match.params)
  const { title, type: resourceType, date } = extractMetadataFromFilename(
    match.params
  )

  const { data: pageData, isLoading: isLoadingPage } = useGetPageHook(
    match.params,
    {
      onError: () => setRedirectToNotFound(siteName),
    }
  )
  const {
    mutateAsync: updatePageHandler,
    isLoading: isSavingPage,
  } = useUpdatePageHook(match.params, {
    onError: (err) => {
      if (err.response.status === 409) setShowOverwriteWarning(true)
    },
    onSuccess: () => setHasChanges(false),
  })
  const { mutateAsync: deletePageHandler } = useDeletePageHook(match.params, {
    onSuccess: () => history.goBack(),
  })

  const { data: csp } = useCspHook(match.params)
  const { data: dirData } = useCollectionHook(match.params)
  const { data: siteColorsData } = useSiteColorsHook(match.params)

  /** ******************************** */
  /*     useEffects to load data     */
  /** ******************************** */

  useEffect(() => {
    if (siteColorsData)
      createPageStyleSheet(
        siteName,
        siteColorsData.primaryColor,
        siteColorsData.secondaryColor
      )
  }, [siteColorsData])

  useEffect(() => {
    if (pageData && !hasChanges) {
      setEditorValue(pageData.content.pageBody.trim())
      setCurrSha(pageData.sha)
    }
  }, [pageData])

  useEffect(() => {
    if (pageData)
      setHasChanges(pageData.content.pageBody.trim() !== editorValue)
  }, [pageData, editorValue])

  useEffect(() => {
    async function editorValueToHtml() {
      const html = marked(editorValue)
      const {
        isCspViolation: checkedIsCspViolation,
        sanitisedHtml: CSPSanitisedHtml,
      } = checkCSP(csp, html)
      const DOMCSPSanitisedHtml = DOMPurify.sanitize(CSPSanitisedHtml)
      const processedChunk = await prependImageSrc(
        siteName,
        DOMCSPSanitisedHtml
      )
      setIsXSSViolation(DOMPurify.removed.length > 0)
      setIsContentViolation(checkedIsCspViolation)
      setHtmlChunk(processedChunk)
    }
    editorValueToHtml()
  }, [editorValue])

  return (
    <>
      <Header
        siteName={siteName}
        title={title}
        shouldAllowEditPageBackNav={!hasChanges}
        isEditPage
        backButtonText={backButtonLabel}
        backButtonUrl={backButtonUrl}
      />
      <div className={elementStyles.wrapper}>
        {isXSSViolation &&
          showXSSWarning && ( // to be refactored later
            <GenericWarningModal
              displayTitle="Warning"
              // DOMPurify removed object format taken from https://github.com/cure53/DOMPurify/blob/dd63379e6354f66d4689bb80b30cb43a6d8727c2/src/purify.js
              displayText={`There is unauthorised JS detected in the following snippet${
                DOMPurify.removed.length > 1 ? "s" : ""
              }:
            ${DOMPurify.removed.map(
              (elem, i) =>
                `<br/><code>${i}</code>: <code>${
                  elem.attribute?.textContent || elem.element?.textContent
                    ? (
                        elem.attribute?.textContent || elem.element?.textContent
                      ).replace("<", "&lt;")
                    : elem
                }</code>`
            )}
            <br/><br/>Before saving, the editor input will be automatically sanitised to prevent security vulnerabilities.
            <br/><br/>To save the sanitised editor input, press Acknowledge. To return to the editor without sanitising, press Cancel.`}
              onProceed={() => {
                const sanitizedEditorValue = DOMPurify.sanitize(editorValue)
                setEditorValue(sanitizedEditorValue)
                setIsXSSViolation(false)
                setShowXSSWarning(false)
                updatePageHandler({
                  frontMatter: pageData.content.frontMatter,
                  sha: currSha,
                  pageBody: sanitizedEditorValue,
                })
              }}
              onCancel={() => {
                setShowXSSWarning(false)
              }}
              cancelText="Cancel"
              proceedText="Acknowledge"
            />
          )}
        {showOverwriteWarning && ( // to be refactored later
          <GenericWarningModal
            displayTitle="Override Changes"
            displayText={`A different version of this page has recently been saved by another user. You can choose to either override their changes, or go back to editing.
              <br/><br/>We recommend you to make a copy of your changes elsewhere, and come back later to reconcile your changes.`}
            onProceed={() => {
              setShowOverwriteWarning(false)
              updatePageHandler({
                frontMatter: pageData.content.frontMatter,
                sha: pageData.sha,
                pageBody: editorValue,
              })
            }}
            onCancel={() => setShowOverwriteWarning(false)}
            cancelText="Back to Editing"
            proceedText="Override"
          />
        )}
        {/* Editor */}
        <MarkdownEditor
          siteName={siteName}
          mdeRef={mdeRef}
          onChange={(value) => setEditorValue(value)}
          value={editorValue}
          isDisabled={resourceType === "file"}
          isLoading={isLoadingPage}
        />
        {/* Preview */}
        <PagePreview
          pageParams={match.params}
          chunk={htmlChunk}
          dirData={dirData}
        />
      </div>
      <EditPageFooter
        isSaveDisabled={isContentViolation}
        deleteCallback={() =>
          deletePageHandler({
            sha: currSha,
          })
        }
        saveCallback={() => {
          if (isXSSViolation) setShowXSSWarning(true)
          else {
            console.log(pageData.sha)
            updatePageHandler({
              frontMatter: pageData.content.frontMatter,
              sha: currSha,
              pageBody: editorValue,
            })
          }
        }}
        isSaving={isSavingPage}
      />
    </>
  )
}

export default EditPageV2

EditPageV2.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      subCollectionName: PropTypes.string,
      collectionName: PropTypes.string,
      resourceRoomName: PropTypes.string,
      resourceCategoryName: PropTypes.string,
      siteName: PropTypes.string,
      fileName: PropTypes.string,
    }),
  }).isRequired,
  history: PropTypes.shape({
    goBack: PropTypes.func,
  }).isRequired,
}
