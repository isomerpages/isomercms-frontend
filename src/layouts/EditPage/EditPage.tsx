import { useState } from "react"
import { useParams } from "react-router-dom"

import { useGetPageHook } from "hooks/pageHooks"

import { MarkdownEditPage } from "./MarkdownEditPage"
import { TiptapEditPage } from "./TiptapEditPage"

export const EditPage = () => {
  const params = useParams<{ siteName: string }>()
  const { data: initialPageData, isLoading: isLoadingPage } = useGetPageHook(
    params
  )
  const [variant, setVariant] = useState(
    initialPageData?.content?.frontMatter?.variant || "markdown"
  )
  return variant === "markdown" ? (
    <MarkdownEditPage
      togglePreview={() => {
        variant === "markdown" ? setVariant("tiptap") : setVariant("markdown")
      }}
    />
  ) : (
    <TiptapEditPage />
  )
}
