import { useDisclosure, Box } from "@chakra-ui/react"
import axios from "axios"
import _ from "lodash"
import { marked } from "marked"
import PropTypes from "prop-types"
import { useEffect, useState } from "react"

import MarkdownEditor from "components/pages/MarkdownEditor"
import PagePreview from "components/pages/PagePreview"

import { useGetMultipleMediaHook } from "hooks/mediaHooks"
import { useGetPageHook } from "hooks/pageHooks"
import { useCspHook } from "hooks/settingsHooks"
import useRedirectHook from "hooks/useRedirectHook"

import { getMediaSrcsFromHtml } from "utils"

import "easymde/dist/easymde.min.css"
import { EditPageLayout } from "./EditPage/EditPageLayout"
import { sanitiseRawHtml, updateHtmlWithMediaData } from "./EditPage/utils"

// axios settings
axios.defaults.withCredentials = true

const EditPage = ({ match }) => {
  const { params, decodedParams } = match
  const { siteName } = decodedParams

  const [editorValue, setEditorValue] = useState("")
  const [mediaSrcs, setMediaSrcs] = useState([])
  const [htmlChunk, setHtmlChunk] = useState("")

  // TODO: Migrate the below 4 to the new `EditPageLayout`
  const [, setCurrSha] = useState("")
  const [hasChanges, setHasChanges] = useState(false)
  const [, setIsContentViolation] = useState(false)
  const [, setIsXSSViolation] = useState(false)

  const { onOpen: onXSSWarningModalOpen } = useDisclosure()

  const { setRedirectToNotFound } = useRedirectHook()

  const { data: pageData, isLoading: isLoadingPage } = useGetPageHook(params, {
    onError: () => setRedirectToNotFound(siteName),
  })

  const { data: csp } = useCspHook()
  const { data: mediaData } = useGetMultipleMediaHook({
    siteName,
    mediaSrcs,
  })

  /** ******************************** */
  /*     useEffects to load data     */
  /** ******************************** */

  useEffect(() => {
    if (pageData && !hasChanges) {
      setEditorValue(pageData.content.pageBody.trim())
      setCurrSha(pageData.sha)
    }
  }, [pageData, hasChanges])

  useEffect(() => {
    if (pageData)
      setHasChanges(pageData.content.pageBody.trim() !== editorValue)
  }, [pageData, editorValue])

  // TODO: We need to migrate this over to `EditPageLayout`
  useEffect(() => {
    if (!csp || _.isEmpty(csp) || !editorValue) return
    const html = marked.parse(editorValue)

    const { sanitisedHtml: DOMCSPSanitisedHtml } = sanitiseRawHtml(csp, html)
    setMediaSrcs(getMediaSrcsFromHtml(DOMCSPSanitisedHtml))
  }, [csp, editorValue])

  useEffect(() => {
    if (!csp || _.isEmpty(csp) || !editorValue) return
    const html = marked.parse(editorValue)
    const { sanitisedHtml } = sanitiseRawHtml(csp, html)

    const {
      html: processedChunk,
      isXssViolation,
      isContentViolation,
    } = updateHtmlWithMediaData(mediaSrcs, sanitisedHtml, mediaData)

    setIsXSSViolation(isXssViolation)
    setIsContentViolation(isContentViolation)
    setHtmlChunk(processedChunk)
  }, [mediaData, editorValue, csp, mediaSrcs, onXSSWarningModalOpen])

  return (
    <EditPageLayout getEditorContent={() => editorValue}>
      {/* Editor */}
      <Box w="50%" p="1.25rem" maxH="100%" overflowY="scroll">
        <MarkdownEditor
          siteName={siteName}
          onChange={(value) => setEditorValue(value)}
          value={editorValue}
          isLoading={isLoadingPage}
        />
      </Box>

      {/* Preview */}
      <PagePreview
        h="calc(100vh - 160px - 1rem)"
        w="62.5rem"
        pageParams={decodedParams}
        title={pageData?.content?.frontMatter?.title || ""}
        chunk={htmlChunk}
      />
    </EditPageLayout>
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
