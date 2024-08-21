import { useDisclosure } from "@chakra-ui/react"
import { getHTMLFromFragment } from "@tiptap/react"
import { Context, useContext, useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { EditorEmbedModal } from "components/EditorEmbedModal"
import HyperlinkModal from "components/HyperlinkModal"
import MediaModal from "components/media/MediaModal"

import { EditorContextProvider } from "contexts/EditorContext"
import { EditorDrawerContextProvider } from "contexts/EditorDrawerContext"
import { EditorModalContextProvider } from "contexts/EditorModalContext"
import { ServicesContext } from "contexts/ServicesContext"

import { useGetPageHook } from "hooks/pageHooks"
import { useCspHook } from "hooks/settingsHooks"

import { isEmbedCodeValid } from "utils/allowedHTML"
import { isEmbedActive } from "utils/tiptap"

import { MediaService } from "services"
import { DrawerVariant, EditorEmbedContents } from "types/editPage"
import { getDecodedParams, getImageDetails } from "utils"

import { useTiptapEditor } from "./hooks/useTiptapEditor"
import { MarkdownEditPage } from "./MarkdownEditPage"
import { TiptapEditPage } from "./TiptapEditPage"

export const EditPage = () => {
  const params = useParams<{ siteName: string }>()
  const decodedParams = getDecodedParams(params)
  const { data: initialPageData } = useGetPageHook(params)
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

  const editor = useTiptapEditor()

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

  const {
    isOpen: isAccordionDrawerOpen,
    onOpen: onAccordionDrawerOpen,
    onClose: onAccordionDrawerClose,
  } = useDisclosure()

  const { siteName } = decodedParams

  const { mediaService } = useContext<{ mediaService: MediaService }>(
    (ServicesContext as unknown) as Context<{ mediaService: MediaService }>
  )

  if (!editor) return null

  const getImageSrc = async (src: string) => {
    if (src.startsWith("https://")) {
      // External link, don't modify
      return { mediaPath: src }
    }
    const { fileName, imageDirectory } = getImageDetails(src)
    const { mediaPath } = await mediaService.get({
      siteName,
      mediaDirectoryName: imageDirectory || "images",
      fileName,
    })
    const normalisedMediaPath = mediaPath.startsWith("images/")
      ? `/${mediaPath}`
      : mediaPath
    return { mediaPath: normalisedMediaPath }
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
    if (drawerType === "accordion") {
      return isAccordionDrawerOpen
    }
    return false
  }

  const onDrawerOpen = (drawerType: DrawerVariant) => {
    if (drawerType === "cards") {
      return onCardsDrawerOpen
    }
    if (drawerType === "accordion") {
      return onAccordionDrawerOpen
    }

    return () => undefined
  }

  const onDrawerClose = (drawerType: DrawerVariant) => {
    if (drawerType === "cards") {
      return onCardsDrawerClose
    }
    if (drawerType === "accordion") {
      return onAccordionDrawerClose
    }

    return () => undefined
  }

  const onDrawerProceed = (drawerType: DrawerVariant) => {
    if (drawerType === "cards") {
      return onCardsDrawerClose
    }
    if (drawerType === "accordion") {
      return onAccordionDrawerClose
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
          isAnyDrawerOpen={isCardsDrawerOpen || isAccordionDrawerOpen}
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
                    `<a target="_blank" rel="noopener nofollow" referrerpolicy="strict-origin-when-cross-origin" href="${href}">${text}</a>`
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
                editor.state.selection.empty || !isEmbedActive(editor)
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
