import axios from "axios"
import { useEffect } from "react"
import { useParams } from "react-router-dom"

import PagePreview from "components/pages/PagePreview"

import { useEditorContext } from "contexts/EditorContext"

import { useGetPageHook } from "hooks/pageHooks"

import { Editor } from "../components/Editor/Editor"

import { DEFAULT_BODY } from "./constants"
import { EditPageLayout } from "./EditPageLayout"

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

  return (
    <EditPageLayout
      setEditorContent={(content) => {
        editor.commands.setContent(content)
      }}
      getEditorContent={() => editor.getHTML()}
      variant="tiptap"
    >
      {/* Editor */}
      <Editor />
      {/* Preview */}
      <PagePreview
        chunk={editor.getHTML()}
        title={initialPageData?.content?.frontMatter?.title || ""}
      />
    </EditPageLayout>
  )
}
