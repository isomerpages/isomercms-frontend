import React, { useEffect, useRef, useState } from "react"
import axios from "axios"
import _ from "lodash"
import PropTypes from "prop-types"
import marked from "marked"

import {
  usePageHook,
  useUpdatePageHook,
  useDeletePageHook,
} from "../hooks/pageHooks"
import { useCollectionHook } from "../hooks/collectionHooks"
import { useCspHook, useSiteColorsHook } from "../hooks/settingsHooks"
import useRedirectHook from "../hooks/useRedirectHook"

import {
  prependImageSrc,
  getBackButton,
  extractMetadataFromFilename,
  prettifyPageFileName,
} from "../utils"
import checkCSP from "../utils/cspUtils"
import { createPageStyleSheet } from "../utils/siteColorUtils"

import "../styles/isomer-template.scss"
import elementStyles from "../styles/isomer-cms/Elements.module.scss"

import Header from "../components/Header"
import DeleteWarningModal from "../components/DeleteWarningModal"
import MarkdownEditor from "../components/pages/MarkdownEditor"
import PagePreview from "../components/pages/PagePreview"
import EditorModals from "../components/pages/EditorModals"
import Footer from "../components/Footer"

// axios settings
axios.defaults.withCredentials = true

const EditPageV2 = ({ match, history }) => {
  const [editorValue, setEditorValue] = useState("")
  const [isCspViolation, setIsCspViolation] = useState(false)
  const [chunk, setChunk] = useState("")

  const [editorModalType, setEditorModalType] = useState("")
  const [insertingMediaType, setInsertingMediaType] = useState("")
  const [showDeleteWarning, setShowDeleteWarning] = useState(false)

  const [hasChanges, setHasChanges] = useState(false)

  const mdeRef = useRef()

  const { setRedirectToNotFound } = useRedirectHook()

  const { siteName } = match.params
  const { backButtonLabel, backButtonUrl } = getBackButton(match.params)
  const { type: resourceType } = extractMetadataFromFilename(match.params)

  /** ******************************** */
  /*   hooks to fetch & update data  */
  /** ******************************** */

  const { data: pageData, isLoading: isLoadingPage } = usePageHook(
    match.params,
    {
      onError: () => setRedirectToNotFound(siteName),
    }
  )
  const { mutateAsync: updatePageHandler } = useUpdatePageHook(match.params)
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
        title={prettifyPageFileName(match.params.fileName)}
        shouldAllowEditPageBackNav={!hasChanges}
        isEditPage
        backButtonText={backButtonLabel}
        backButtonUrl={backButtonUrl}
      />
      <div className={elementStyles.wrapper}>
        <EditorModals
          siteName={siteName}
          mdeRef={mdeRef}
          setEditorValue={setEditorValue}
          modalType={editorModalType}
          setModalType={setEditorModalType}
          insertingMediaType={insertingMediaType}
          setInsertingMediaType={setInsertingMediaType}
        />
        {/* Editor */}
        <MarkdownEditor
          mdeRef={mdeRef}
          onChange={(value) => setEditorValue(value)}
          value={editorValue}
          customOptions={{
            imageAction: async () => {
              setEditorModalType("media")
              setInsertingMediaType("images")
            },
            fileAction: async () => {
              setEditorModalType("media")
              setInsertingMediaType("files")
            },
            linkAction: async () => {
              setEditorModalType("hyperlink")
            },
          }}
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
      {showDeleteWarning && (
        <DeleteWarningModal
          onCancel={() => setShowDeleteWarning(false)}
          onDelete={() =>
            deletePageHandler({
              sha: pageData.sha,
            })
          }
          type="page"
        />
      )}
      <Footer
        isSaveDisabled={isCspViolation}
        deleteCallback={() => setShowDeleteWarning(true)}
        saveCallback={() =>
          updatePageHandler({
            frontMatter: pageData.content.frontMatter,
            sha: pageData.sha,
            pageBody: editorValue,
          })
        }
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
