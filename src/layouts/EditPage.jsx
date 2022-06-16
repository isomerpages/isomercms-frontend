import { useDisclosure } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import axios from "axios"
import Footer from "components/Footer"
import { GenericWarningModal } from "components/GenericWarningModal"
import Header from "components/Header"
import MarkdownEditor from "components/pages/MarkdownEditor"
import PagePreview from "components/pages/PagePreview"
import DOMPurify from "dompurify"
import { marked } from "marked"
import PropTypes from "prop-types"
import { useEffect, useRef, useState } from "react"

import { useCollectionHook } from "hooks/collectionHooks"
import { useGetPageHook, useUpdatePageHook } from "hooks/pageHooks"
import { useCspHook, useGetSiteColorsHook } from "hooks/settingsHooks"
import useRedirectHook from "hooks/useRedirectHook"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

// Isomer utils
import checkCSP from "utils/cspUtils"
import { createPageStyleSheet } from "utils/siteColorUtils"

import { prependImageSrc } from "utils"

import "easymde/dist/easymde.min.css"

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

const EditPage = ({ match }) => {
  const { params, decodedParams } = match
  const { siteName } = decodedParams

  const [editorValue, setEditorValue] = useState("")
  const [currSha, setCurrSha] = useState("")
  const [htmlChunk, setHtmlChunk] = useState("")

  const [hasChanges, setHasChanges] = useState(false)
  const [isContentViolation, setIsContentViolation] = useState(false)
  const [isXSSViolation, setIsXSSViolation] = useState(false)

  const {
    isOpen: isXSSOpen,
    onOpen: onXSSOpen,
    onClose: onXSSClose,
  } = useDisclosure()
  const {
    isOpen: isOverwriteOpen,
    onOpen: onOverwriteOpen,
    onClose: onOverwriteClose,
  } = useDisclosure()

  const { setRedirectToNotFound } = useRedirectHook()

  const mdeRef = useRef()

  const { data: pageData, isLoading: isLoadingPage } = useGetPageHook(params, {
    onError: () => setRedirectToNotFound(siteName),
  })
  const {
    mutateAsync: updatePageHandler,
    isLoading: isSavingPage,
  } = useUpdatePageHook(params, {
    onError: (err) => {
      if (err.response.status === 409) onOverwriteOpen()
    },
    onSuccess: () => setHasChanges(false),
  })

  const { data: csp } = useCspHook(params)
  const { data: dirData } = useCollectionHook(params)
  const { data: siteColorsData } = useGetSiteColorsHook(params)

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
      const html = marked.parse(editorValue)
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
        title={pageData?.content?.frontMatter?.title || ""}
        shouldAllowEditPageBackNav={!hasChanges}
        isEditPage
        params={decodedParams}
      />
      <div className={elementStyles.wrapper}>
        {isXSSViolation && (
          <GenericWarningModal
            isOpen={isXSSOpen}
            onClose={onXSSClose}
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
          >
            <Button colorScheme="danger" onClick={onXSSClose}>
              Cancel
            </Button>
            <Button
              onClick={() => {
                const sanitizedEditorValue = DOMPurify.sanitize(editorValue)
                setEditorValue(sanitizedEditorValue)
                setIsXSSViolation(false)
                updatePageHandler({
                  pageData: {
                    frontMatter: pageData.content.frontMatter,
                    sha: currSha,
                    pageBody: sanitizedEditorValue,
                  },
                })
                onXSSClose()
              }}
            >
              Acknowledge
            </Button>
          </GenericWarningModal>
        )}
        <GenericWarningModal
          isOpen={isOverwriteOpen}
          onClose={onOverwriteClose}
          displayTitle="Override Changes"
          displayText={`A different version of this page has recently been saved by another user. You can choose to either override their changes, or go back to editing.
            <br/><br/>We recommend you to make a copy of your changes elsewhere, and come back later to reconcile your changes.`}
        >
          <Button
            variant="ghost"
            colorScheme="secondary"
            onClick={onOverwriteClose}
          >
            Back to Editing
          </Button>
          <Button
            colorScheme="danger"
            onClick={() => {
              onOverwriteClose()
              updatePageHandler({
                pageData: {
                  frontMatter: pageData.content.frontMatter,
                  sha: pageData.sha,
                  pageBody: editorValue,
                },
              })
            }}
          >
            Override
          </Button>
        </GenericWarningModal>
        {/* Editor */}
        <MarkdownEditor
          siteName={siteName}
          mdeRef={mdeRef}
          onChange={(value) => setEditorValue(value)}
          value={editorValue}
          isLoading={isLoadingPage}
        />
        {/* Preview */}
        <PagePreview
          pageParams={decodedParams}
          title={pageData?.content?.frontMatter?.title || ""}
          chunk={htmlChunk}
          dirData={dirData}
        />
      </div>
      <Footer
        isKeyButtonDisabled={isContentViolation}
        keyCallback={() => {
          if (isXSSViolation) onXSSOpen()
          else {
            updatePageHandler({
              pageData: {
                frontMatter: pageData.content.frontMatter,
                sha: currSha,
                pageBody: editorValue,
              },
            })
          }
        }}
        keyButtonIsLoading={isSavingPage}
      />
    </>
  )
}

export default EditPage

EditPage.propTypes = {
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
}
