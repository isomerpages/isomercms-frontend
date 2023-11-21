import axios from "axios"
import DOMPurify from "dompurify"
import _ from "lodash"
import { marked } from "marked"
import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import PagePreview from "components/pages/PagePreview"

import { useEditorContext } from "contexts/EditorContext"

import { useGetMultipleMediaHook } from "hooks/mediaHooks"
import { useGetPageHook } from "hooks/pageHooks"
import { useCspHook } from "hooks/settingsHooks"

import checkCSP from "utils/cspUtils"
import { getMediaSrcsFromHtml } from "utils/images"

import { Editor } from "../components/Editor/Editor"

import { DEFAULT_BODY } from "./constants"
import { EditPageLayout } from "./EditPageLayout"
import { sanitiseRawHtml, updateHtmlWithMediaData } from "./utils"

// axios settings
axios.defaults.withCredentials = true

interface TiptapEditPageProps {
  shouldUseFetchedData?: boolean
}
export const TiptapEditPage = ({
  shouldUseFetchedData,
}: TiptapEditPageProps) => {
  const params = useParams<{ siteName: string }>()
  const { data: initialPageData, isLoading: isLoadingPage } = useGetPageHook(
    params
  )

  const { editor } = useEditorContext()

  useEffect(() => {
    if (!isLoadingPage && shouldUseFetchedData) {
      // NOTE: If the page load is completed, set the content
      // only if the existing page body has content.
      if (initialPageData?.content?.pageBody) {
        editor?.commands.setContent(initialPageData?.content?.pageBody)
      } else {
        // Otherwise, prefill with the default
        editor?.commands.setContent(DEFAULT_BODY)
      }
    }
    // NOTE: We disable as the editor is a class and holds its own internal state.
    // Adding it here would cause a render on every keystroke.
  }, [
    editor,
    isLoadingPage,
    initialPageData?.content?.pageBody,
    shouldUseFetchedData,
  ])

  const [htmlChunk, setHtmlChunk] = useState("")
  const [mediaSrcs, setMediaSrcs] = useState<Set<string>>(new Set<string>(""))
  const editorHtmlValue = editor.getHTML()
  const { data: csp } = useCspHook()
  const { siteName } = useParams<{ siteName: string }>()
  const { data: mediaData } = useGetMultipleMediaHook({
    siteName,
    mediaSrcs,
  })

  const updateMediaSrcs = useCallback(() => {
    if (!csp || _.isEmpty(csp) || !editorHtmlValue) return
    const html = marked.parse(editorHtmlValue)
    const { sanitisedHtml: CSPSanitisedHtml } = checkCSP(csp, html)
    const DOMCSPSanitisedHtml = DOMPurify.sanitize(CSPSanitisedHtml)
    setMediaSrcs(getMediaSrcsFromHtml(DOMCSPSanitisedHtml))
  }, [csp, editorHtmlValue])

  useEffect(() => {
    updateMediaSrcs()
  }, [updateMediaSrcs])

  useEffect(() => {
    if (!csp || _.isEmpty(csp) || !editorHtmlValue) return
    const html = marked.parse(editorHtmlValue)
    const { sanitisedHtml } = sanitiseRawHtml(csp, html)

    const { html: processedChunk } = updateHtmlWithMediaData(
      mediaSrcs,
      sanitisedHtml,
      mediaData
    )
    setHtmlChunk(processedChunk)
  }, [mediaData, editorHtmlValue, csp, mediaSrcs])

  return (
    <EditPageLayout
      setEditorContent={(content) => {
        editor.commands.setContent(content)
      }}
      getEditorContent={() => editor.getHTML()}
      variant="tiptap"
    >
      {/* Editor */}
      <Editor h="80vh" w="45vw" />
      {/* Preview */}
      <PagePreview
        // NOTE: Reserve 45vw for editor
        w="calc(100% - 45vw)"
        h="calc(100vh - 160px - 1rem)"
        chunk={htmlChunk}
        title={initialPageData?.content?.frontMatter?.title || ""}
      />
    </EditPageLayout>
  )
}
