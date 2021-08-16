import React, { useEffect, useRef, useState } from "react"
import axios from "axios"
import _ from "lodash"
import PropTypes from "prop-types"
import marked from "marked"
import checkCSP from "../utils/cspUtils"

import {
  usePageHook,
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

import "easymde/dist/easymde.min.css"
import "../styles/isomer-template.scss"
import elementStyles from "../styles/isomer-cms/Elements.module.scss"
import Header from "../components/Header"
import MarkdownEditor from "../components/pages/MarkdownEditor"
import PagePreview from "../components/pages/PagePreview"
import EditPageFooter from "../components/pages/EditPageFooter"

// axios settings
axios.defaults.withCredentials = true

const EditPageV2 = ({ match, history }) => {
  const { siteName } = match.params
  const [editorValue, setEditorValue] = useState("")
  const [isCspViolation, setIsCspViolation] = useState(false)
  const [chunk, setChunk] = useState("")

  const [hasChanges, setHasChanges] = useState(false)
  const { setRedirectToNotFound } = useRedirectHook()

  const mdeRef = useRef()

  const { backButtonLabel, backButtonUrl } = getBackButton(match.params)
  const { title, type: resourceType, date } = extractMetadataFromFilename(
    match.params
  )

  const { data: pageData, isLoading: isLoadingPage } = usePageHook(
    match.params,
    {
      onError: () => setRedirectToNotFound(siteName),
    }
  )
  const {
    mutateAsync: updatePageHandler,
    isLoading: isSavingPage,
  } = useUpdatePageHook(match.params)
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
    if (pageData && !hasChanges)
      setEditorValue(pageData.content.pageBody.trim())
  }, [pageData])

  useEffect(() => {
    if (pageData)
      setHasChanges(pageData.content.pageBody.trim() !== editorValue)
  }, [pageData, editorValue])

  useEffect(() => {
    async function loadChunk() {
      const html = marked(editorValue)
      const {
        isCspViolation: checkedIsCspViolation,
        sanitisedHtml: processedSanitisedHtml,
      } = checkCSP(csp, html)
      const processedChunk = await prependImageSrc(
        siteName,
        processedSanitisedHtml
      )
      setIsCspViolation(checkedIsCspViolation)
      setChunk(processedChunk)
    }
    loadChunk()
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
          chunk={chunk}
          dirData={dirData}
        />
      </div>
      <EditPageFooter
        isSaveDisabled={isCspViolation}
        deleteCallback={() =>
          deletePageHandler({
            sha: pageData.sha,
          })
        }
        saveCallback={() =>
          updatePageHandler({
            frontMatter: pageData.content.frontMatter,
            sha: pageData.sha,
            pageBody: editorValue,
          })
        }
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
