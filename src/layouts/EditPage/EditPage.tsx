import { useDisclosure } from "@chakra-ui/react"
import BubbleMenu from "@tiptap/extension-bubble-menu"
import CharacterCount from "@tiptap/extension-character-count"
import Highlight from "@tiptap/extension-highlight"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import Table from "@tiptap/extension-table"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import TableRow from "@tiptap/extension-table-row"
import TaskItem from "@tiptap/extension-task-item"
import TaskList from "@tiptap/extension-task-list"
import { useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Context, useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Markdown } from "tiptap-markdown"

import MediaModal from "components/media/MediaModal"

import { EditorContextProvider } from "contexts/EditorContext"
import { EditorModalContextProvider } from "contexts/EditorModalContext"
import { ServicesContext } from "contexts/ServicesContext"

import { useGetPageHook } from "hooks/pageHooks"

import { Iframe } from "layouts/components/Editor/extensions"

import { MediaService } from "services"
import { getDecodedParams, getImageDetails } from "utils"

import { MarkdownEditPage } from "./MarkdownEditPage"
import { TiptapEditPage } from "./TiptapEditPage"

export const EditPage = () => {
  const params = useParams<{ siteName: string }>()
  const decodedParams = getDecodedParams(params)
  const { data: initialPageData, isLoading: isLoadingPage } = useGetPageHook(
    params
  )
  const [variant, setVariant] = useState(
    initialPageData?.content?.frontMatter?.variant || "markdown"
  )
  const [mediaType, setMediaType] = useState<"files" | "images">("images")

  // NOTE: We require this `useEffect` here to sync the variant.
  // Oddly enough, it's not rerunning when the fetched data changes.
  useEffect(() => {
    if (initialPageData?.content?.frontMatter?.variant)
      setVariant(initialPageData?.content?.frontMatter?.variant)
  }, [initialPageData?.content?.frontMatter?.variant])

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      TaskList,
      TaskItem,
      CharacterCount,
      Image.configure({ allowBase64: true }),
      Link.configure({ openOnClick: false }),
      Iframe,
      Markdown,
      BubbleMenu.configure({
        pluginKey: "linkBubble",
      }),
      BubbleMenu.configure({
        pluginKey: "tableBubble",
      }),
      Table.configure({
        resizable: true,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Placeholder,
    ],
    autofocus: "start",
  })

  const {
    isOpen: isMediaModalOpen,
    onOpen: onMediaModalOpen,
    onClose: onMediaModalClose,
  } = useDisclosure()

  const { siteName } = decodedParams

  const { mediaService } = useContext<{ mediaService: MediaService }>(
    (ServicesContext as unknown) as Context<{ mediaService: MediaService }>
  )

  const getImageSrc = async (src: string) => {
    const { fileName, imageDirectory } = getImageDetails(src)
    return mediaService.get({
      siteName,
      mediaDirectoryName: imageDirectory || "images",
      fileName,
    })
  }

  if (!editor) return null

  return (
    <EditorContextProvider editor={editor}>
      <EditorModalContextProvider
        showModal={(modalType) => {
          setMediaType(modalType)
          onMediaModalOpen()
        }}
      >
        {isMediaModalOpen && (
          <MediaModal
            onClose={onMediaModalClose}
            type={mediaType}
            onProceed={async ({ selectedMediaPath, altText }) => {
              if (mediaType === "images") {
                const { mediaUrl } = await getImageSrc(selectedMediaPath)
                editor
                  ?.chain()
                  .focus()
                  .setImage({
                    src: mediaUrl,
                    alt: altText,
                  })
                  .run()
              } else {
                editor
                  ?.chain()
                  .focus()
                  .setLink({ href: selectedMediaPath })
                  .run()
              }
              onMediaModalClose()
            }}
          />
        )}

        {variant === "markdown" ? (
          <MarkdownEditPage
            togglePreview={() => {
              variant === "markdown"
                ? setVariant("tiptap")
                : setVariant("markdown")
            }}
          />
        ) : (
          <TiptapEditPage
            // NOTE: We should not use the fetched data if the variant
            // changed from `markdown` -> `tiptap`.
            // This is because this implies that the user has
            // changed the variant from markdown to tiptap.
            // Hence, there might be changes in either markdown editor content
            // or in the preview editor that should be persisted.
            shouldUseFetchedData={
              variant === "tiptap" &&
              initialPageData?.content?.frontMatter?.variant === "tiptap"
            }
          />
        )}
      </EditorModalContextProvider>
    </EditorContextProvider>
  )
}
