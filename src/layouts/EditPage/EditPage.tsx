import { useDisclosure, Flex, Spacer } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
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
import {
  useEffect,
  useContext,
  Context,
  useState,
  PropsWithChildren,
} from "react"
import { useParams } from "react-router-dom"
import { Markdown } from "tiptap-markdown"

import { Footer } from "components/Footer"
import { Greyscale } from "components/Greyscale"
import Header from "components/Header"
import MediaModal from "components/media/MediaModal"
import PagePreview from "components/pages/PagePreview"

import { EditorContextProvider } from "contexts/EditorContext"
import { EditorModalContextProvider } from "contexts/EditorModalContext"
import { ServicesContext } from "contexts/ServicesContext"

import { useGetPageHook, useUpdatePageHook } from "hooks/pageHooks"
import { useGetSiteColorsHook } from "hooks/settingsHooks"
import useRedirectHook from "hooks/useRedirectHook"

import Iframe from "layouts/components/Editor/Iframe"

import { MediaService } from "services/MediaService"

import { getImageDetails } from "utils/images"
import { isWriteActionsDisabled } from "utils/reviewRequests"
import { createPageStyleSheet } from "utils/siteColorUtils"

// Isomer utils

import { getDecodedParams } from "utils"

import "easymde/dist/easymde.min.css"

import { Editor } from "../components/Editor/Editor"

import { DEFAULT_BODY } from "./constants"

// axios settings
axios.defaults.withCredentials = true

interface EditPageLayoutProps {
  getPageBody: () => string
}

const EditPageLayout = ({
  getPageBody,
  children,
}: PropsWithChildren<EditPageLayoutProps>) => {
  const params = useParams<{ siteName: string }>()
  const decodedParams = getDecodedParams(params)
  const {
    mutateAsync: updatePageHandler,
    isLoading: isSavingPage,
  } = useUpdatePageHook(params, {
    // NOTE: Not deleting this as this is important enough
    // to leave here so that we avoid regression.
    // onError: (err) => {
    //   if (err.response.status === 409) onOverwriteOpen()
    // },
  })

  const { siteName } = decodedParams

  const { setRedirectToNotFound } = useRedirectHook()
  const { data: pageData, isLoading: isLoadingPage } = useGetPageHook(params, {
    onError: () => setRedirectToNotFound(siteName),
  })
  const { data: siteColorsData } = useGetSiteColorsHook(params)

  const isWriteDisabled = isWriteActionsDisabled(siteName)

  useEffect(() => {
    if (siteColorsData)
      createPageStyleSheet(
        siteName,
        siteColorsData.primaryColor,
        siteColorsData.secondaryColor
      )
  }, [siteColorsData, siteName])

  return (
    <Greyscale isActive={isWriteDisabled}>
      <Flex flexDir="column" h="full">
        <Header
          title={pageData?.content?.frontMatter?.title || ""}
          // TODO: Add this check back in dynamically
          shouldAllowEditPageBackNav
          isEditPage
          params={decodedParams}
        />
        <Flex flexDir="row" w="100%" h="100%">
          {/* Editor */}
          {children}
        </Flex>
        <Spacer />
        <Footer>
          <Button
            onClick={() => {
              updatePageHandler(({
                pageData: {
                  frontMatter: pageData?.content?.frontMatter,
                  pageBody: getPageBody(),
                  sha: pageData.sha,
                },
              } as unknown) as void)
            }}
            isLoading={isSavingPage}
          >
            Save
          </Button>
        </Footer>
      </Flex>
    </Greyscale>
  )
}

export const EditPage = () => {
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
    <EditPageLayout getPageBody={() => editor.getHTML()}>
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
