import { useDisclosure, HStack, VStack } from "@chakra-ui/react"
import { Button } from "@opengovsg/design-system-react"
import CharacterCount from "@tiptap/extension-character-count"
import Highlight from "@tiptap/extension-highlight"
import Image from "@tiptap/extension-image"
import Link from "@tiptap/extension-link"
import TaskItem from "@tiptap/extension-task-item"
import TaskList from "@tiptap/extension-task-list"
import { useEditor } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import axios from "axios"
import _ from "lodash"
import { useEffect, useContext, Context, useState } from "react"
import { useParams } from "react-router-dom"

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

import { MediaService } from "services/MediaService"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

import { getImageDetails } from "utils/images"
import { isWriteActionsDisabled } from "utils/reviewRequests"
import { createPageStyleSheet } from "utils/siteColorUtils"

// Isomer utils

import { getDecodedParams } from "utils"

import "easymde/dist/easymde.min.css"

import { Editor } from "../components/Editor/Editor"

// axios settings
axios.defaults.withCredentials = true

export const EditPage = () => {
  const params = useParams<{ siteName: string }>()
  const decodedParams = getDecodedParams(params)
  const [mediaType, setMediaType] = useState<"files" | "images">("images")

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

  const { setRedirectToNotFound } = useRedirectHook()

  const { data: pageData, isLoading: isLoadingPage } = useGetPageHook(params, {
    onError: () => setRedirectToNotFound(siteName),
  })

  const editor = useEditor({
    extensions: [
      StarterKit,
      Highlight,
      TaskList,
      TaskItem,
      CharacterCount,
      Image.configure({ allowBase64: true }),
      Link.configure({ openOnClick: false }),
    ],
    content: pageData?.content?.pageBody,
  })

  const {
    isOpen: isMediaModalOpen,
    onOpen: onMediaModalOpen,
    onClose: onMediaModalClose,
  } = useDisclosure()

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

  const { data: siteColorsData } = useGetSiteColorsHook(params)
  const isWriteDisabled = isWriteActionsDisabled(siteName)

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
  }, [siteColorsData, siteName])

  useEffect(() => {
    if (!isLoadingPage) {
      editor?.commands.setContent(pageData?.content?.pageBody)
    }
  }, [isLoadingPage])

  return (
    <EditorContextProvider editor={editor}>
      <EditorModalContextProvider
        showModal={(modalType) => {
          setMediaType(modalType)
          onMediaModalOpen()
        }}
      >
        <VStack>
          <Header
            title={pageData?.content?.frontMatter?.title || ""}
            shouldAllowEditPageBackNav
            isEditPage
            params={decodedParams}
          />
          <Greyscale isActive={isWriteDisabled}>
            <HStack className={elementStyles.wrapper}>
              {isMediaModalOpen && (
                <MediaModal
                  onClose={onMediaModalClose}
                  type={mediaType}
                  onProceed={async ({ selectedMediaPath, altText }) => {
                    console.log("mediaType", mediaType)
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
                title={pageData?.content?.frontMatter?.title || ""}
              />
            </HStack>
            <Footer>
              <Button
                onClick={() => {
                  updatePageHandler(({
                    pageData: {
                      frontMatter: pageData.content.frontMatter,
                      pageBody: editor?.getHTML(),
                      sha: pageData.sha,
                    },
                  } as unknown) as void)
                }}
                isLoading={isSavingPage}
              >
                Save
              </Button>
            </Footer>
          </Greyscale>
        </VStack>
      </EditorModalContextProvider>
    </EditorContextProvider>
  )
}
