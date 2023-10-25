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
import axios from "axios"
import { useEffect, useContext, Context, useState } from "react"
import { useParams } from "react-router-dom"
import { Markdown } from "tiptap-markdown"

import MediaModal from "components/media/MediaModal"
import PagePreview from "components/pages/PagePreview"

import { EditorContextProvider } from "contexts/EditorContext"
import { EditorModalContextProvider } from "contexts/EditorModalContext"
import { ServicesContext } from "contexts/ServicesContext"

import { useGetPageHook } from "hooks/pageHooks"

import Iframe from "layouts/components/Editor/Iframe"

import { MediaService } from "services/MediaService"

import { getImageDetails } from "utils/images"

// Isomer utils

import { getDecodedParams } from "utils"

import "easymde/dist/easymde.min.css"

import { Editor } from "../components/Editor/Editor"

import { DEFAULT_BODY } from "./constants"
import { EditPageLayout } from "./EditPageLayout"

// axios settings
axios.defaults.withCredentials = true

export const TiptapEditPage = () => {
  const params = useParams<{ siteName: string }>()
  const decodedParams = getDecodedParams(params)
  const [mediaType, setMediaType] = useState<"files" | "images">("images")
  const { data: initialPageData, isLoading: isLoadingPage } = useGetPageHook(
    params
  )

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

  useEffect(() => {
    if (!isLoadingPage) {
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
  }, [editor, isLoadingPage, initialPageData?.content?.pageBody])

  if (!editor) return null

  return (
    <EditPageLayout getPageBody={() => editor.getHTML()} variant="tiptap">
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

          {/* Editor */}
          <Editor />
          {/* Preview */}
          <PagePreview
            chunk={editor.getHTML()}
            title={initialPageData?.content?.frontMatter?.title || ""}
          />
        </EditorModalContextProvider>
      </EditorContextProvider>
    </EditPageLayout>
  )
}
