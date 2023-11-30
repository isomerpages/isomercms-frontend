import { useDisclosure } from "@chakra-ui/react"
import BubbleMenu from "@tiptap/extension-bubble-menu"
import CharacterCount from "@tiptap/extension-character-count"
import Highlight from "@tiptap/extension-highlight"
import Link from "@tiptap/extension-link"
import Placeholder from "@tiptap/extension-placeholder"
import Table from "@tiptap/extension-table"
import TableCell from "@tiptap/extension-table-cell"
import TableHeader from "@tiptap/extension-table-header"
import TableRow from "@tiptap/extension-table-row"
import TaskItem from "@tiptap/extension-task-item"
import TaskList from "@tiptap/extension-task-list"
import Underline from "@tiptap/extension-underline"
import { getHTMLFromFragment, useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import { Context, useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Markdown } from "tiptap-markdown"

import { EditorEmbedModal } from "components/EditorEmbedModal"
import HyperlinkModal from "components/HyperlinkModal"
import MediaModal from "components/media/MediaModal"

import { EditorContextProvider } from "contexts/EditorContext"
import { EditorDrawerContextProvider } from "contexts/EditorDrawerContext"
import { EditorModalContextProvider } from "contexts/EditorModalContext"
import { ServicesContext } from "contexts/ServicesContext"

import { useGetPageHook } from "hooks/pageHooks"
import { useCspHook } from "hooks/settingsHooks"

import {
  FormSG,
  FormSGDiv,
  FormSGIframe,
  Iframe,
  Instagram,
  IsomerCard,
  IsomerCardBody,
  IsomerCardDescription,
  IsomerCardImage,
  IsomerCardLink,
  IsomerCards,
  IsomerCardTitle,
  IsomerClickableCard,
  IsomerImage,
  TrailingNode,
} from "layouts/components/Editor/extensions"

import { isEmbedCodeValid } from "utils/allowedHTML"

import { MediaService } from "services"
import { DrawerVariant, EditorEmbedContents } from "types/editPage"
import { getDecodedParams, getImageDetails } from "utils"

import { MarkdownEditPage } from "./MarkdownEditPage"
import { TiptapEditPage } from "./TiptapEditPage"

export const EditPage = () => {
  const params = useParams<{ siteName: string }>()
  const decodedParams = getDecodedParams(params)
  const { data: initialPageData, isLoading: isLoadingPage } = useGetPageHook(
    params
  )
  const { data: csp } = useCspHook()
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
      IsomerImage,
      Link.extend({
        priority: 100,
        parseHTML() {
          return [{ tag: "a:not(.isomer-card)" }]
        },
      }).configure({
        openOnClick: false,
        protocols: ["mailto"],
      }),
      Iframe,
      FormSG,
      FormSGDiv,
      FormSGIframe,
      Instagram,
      IsomerCards,
      IsomerCard,
      IsomerClickableCard,
      IsomerCardImage,
      IsomerCardBody,
      IsomerCardTitle,
      IsomerCardDescription,
      IsomerCardLink,
      Markdown,
      BubbleMenu.configure({
        pluginKey: "linkBubble",
      }),
      BubbleMenu.configure({
        pluginKey: "tableBubble",
      }),
      BubbleMenu.configure({
        pluginKey: "imageBubble",
      }),
      BubbleMenu.configure({
        pluginKey: "cardsBubble",
      }),
      Table.configure({
        resizable: false,
      }),
      TableRow,
      TableHeader,
      TableCell,
      Underline,
      Placeholder,
      TrailingNode,
    ],
    autofocus: "start",
  })

  const {
    isOpen: isMediaModalOpen,
    onOpen: onMediaModalOpen,
    onClose: onMediaModalClose,
  } = useDisclosure()

  const {
    isOpen: isHyperlinkModalOpen,
    onOpen: onHyperlinkModalOpen,
    onClose: onHyperlinkModalClose,
  } = useDisclosure()

  const {
    isOpen: isEmbedModalOpen,
    onOpen: onEmbedModalOpen,
    onClose: onEmbedModalClose,
  } = useDisclosure()

  const {
    isOpen: isCardsDrawerOpen,
    onOpen: onCardsDrawerOpen,
    onClose: onCardsDrawerClose,
  } = useDisclosure()

  const { siteName } = decodedParams

  const { mediaService } = useContext<{ mediaService: MediaService }>(
    (ServicesContext as unknown) as Context<{ mediaService: MediaService }>
  )

  if (!editor) return null

  const getImageSrc = async (src: string) => {
    const { fileName, imageDirectory } = getImageDetails(src)
    const { mediaPath, mediaUrl } = await mediaService.get({
      siteName,
      mediaDirectoryName: imageDirectory || "images",
      fileName,
    })
    const nomalisedMediaPath = mediaPath.startsWith("images/")
      ? `/${mediaPath}`
      : mediaPath
    return { mediaPath: nomalisedMediaPath, mediaUrl }
  }

  const handleEmbedInsert = ({ value }: EditorEmbedContents) => {
    if (isEmbedCodeValid(csp, value)) {
      editor.chain().focus().insertContent(value.replaceAll("\n", "")).run()
    }

    onEmbedModalClose()
  }

  const isDrawerOpen = (drawerType: DrawerVariant) => {
    if (drawerType === "cards") {
      return isCardsDrawerOpen
    }
    return false
  }

  const onDrawerOpen = (drawerType: DrawerVariant) => {
    if (drawerType === "cards") {
      return onCardsDrawerOpen
    }

    return () => undefined
  }

  const onDrawerClose = (drawerType: DrawerVariant) => {
    if (drawerType === "cards") {
      return onCardsDrawerClose
    }

    return () => undefined
  }

  const onDrawerProceed = (drawerType: DrawerVariant) => {
    if (drawerType === "cards") {
      return onCardsDrawerClose
    }

    return () => undefined
  }

  return (
    <EditorContextProvider editor={editor}>
      <EditorModalContextProvider
        showModal={(modalType) => {
          if (modalType === "hyperlink") {
            onHyperlinkModalOpen()
          } else if (modalType === "embed") {
            onEmbedModalOpen()
          } else {
            setMediaType(modalType)
            onMediaModalOpen()
          }
        }}
      >
        <EditorDrawerContextProvider
          isAnyDrawerOpen={isCardsDrawerOpen}
          isDrawerOpen={isDrawerOpen}
          onDrawerOpen={onDrawerOpen}
          onDrawerClose={onDrawerClose}
          onDrawerProceed={onDrawerProceed}
        >
          {isHyperlinkModalOpen && (
            <HyperlinkModal
              initialText=""
              onSave={(text, href) => {
                editor
                  .chain()
                  .focus()
                  .insertContent(
                    `<a target="_blank" rel="noopener noreferrer nofollow" href="${href}">${text}</a>`
                  )
                  .run()
                onHyperlinkModalClose()
              }}
              onClose={onHyperlinkModalClose}
            />
          )}
          {isMediaModalOpen && (
            <MediaModal
              showAltTextModal
              onClose={onMediaModalClose}
              type={mediaType}
              onProceed={async ({ selectedMediaPath, altText }) => {
                if (mediaType === "images") {
                  const { mediaPath } = await getImageSrc(selectedMediaPath)
                  editor
                    .chain()
                    .focus()
                    .setImage({
                      src: mediaPath,
                      alt: altText,
                    })
                    .run()
                  // NOTE: If it's a file and there's no selection made, just add a link with default text
                } else if (editor.state.selection.empty) {
                  editor
                    .chain()
                    .focus()
                    .insertContent(
                      `<a target="_blank" rel="noopener noreferrer nofollow" href="${selectedMediaPath}">${
                        altText || "file"
                      }</a>`
                    )
                    .run()
                } else {
                  editor
                    .chain()
                    .focus()
                    .setLink({ href: selectedMediaPath })
                    .run()
                }
                onMediaModalClose()
              }}
            />
          )}
          {isEmbedModalOpen && (
            <EditorEmbedModal
              isOpen={isEmbedModalOpen}
              onClose={onEmbedModalClose}
              onProceed={handleEmbedInsert}
              cursorValue={
                editor.state.selection.empty
                  ? ""
                  : getHTMLFromFragment(
                      editor.state.selection.content().content,
                      editor.schema
                    )
              }
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
        </EditorDrawerContextProvider>
      </EditorModalContextProvider>
    </EditorContextProvider>
  )
}
