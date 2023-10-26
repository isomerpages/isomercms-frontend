import { Flex, Spacer, Button, useDisclosure } from "@chakra-ui/react"
import { AxiosError } from "axios"
import { PropsWithChildren, useEffect } from "react"
import { useParams } from "react-router-dom"

import { Footer } from "components/Footer"
import { Greyscale } from "components/Greyscale"
import Header from "components/Header"
import { OverwriteChangesModal } from "components/OverwriteChangesModal"

import { useGetPageHook, useUpdatePageHook } from "hooks/pageHooks"
import { useGetSiteColorsHook } from "hooks/settingsHooks"
import useRedirectHook from "hooks/useRedirectHook"

import { isWriteActionsDisabled } from "utils/reviewRequests"

import { createPageStyleSheet, getDecodedParams } from "utils"

interface EditPageLayoutProps {
  getEditorContent: () => string
  variant: "markdown" | "tiptap"
}

export const EditPageLayout = ({
  getEditorContent,
  variant = "markdown",
  children,
}: PropsWithChildren<EditPageLayoutProps>) => {
  const params = useParams<{ siteName: string }>()
  const decodedParams = getDecodedParams(params)
  const {
    isOpen: isOverwriteOpen,
    onOpen: onOverwriteOpen,
    onClose: onOverwriteClose,
  } = useDisclosure()

  const {
    mutateAsync: updatePageHandler,
    isLoading: isSavingPage,
  } = useUpdatePageHook(params, {
    onError: (err: AxiosError) => {
      if (err.response?.status === 409) onOverwriteOpen()
    },
  })

  const { siteName } = decodedParams

  const { setRedirectToNotFound } = useRedirectHook()
  // TODO: Add loading state for page
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

  const onSave = () => {
    updatePageHandler(({
      pageData: {
        frontMatter: {
          ...(pageData?.content?.frontMatter || {}),
          variant,
        },
        pageBody: getEditorContent(),
        sha: pageData.sha,
      },
      // NOTE: We require the cast here as the original hook is written in js.
      // because of this, the return handler has types as `unknown`
    } as unknown) as void)
  }

  return (
    <>
      <OverwriteChangesModal
        isOpen={isOverwriteOpen}
        onClose={onOverwriteClose}
        onProceed={() => {
          onSave()
          onOverwriteClose()
        }}
      />

      <Greyscale isActive={isWriteDisabled}>
        <Flex flexDir="column" h="full">
          <Header
            title={pageData?.content?.frontMatter?.title || ""}
            shouldAllowEditPageBackNav={
              getEditorContent() === pageData?.content?.pageBody?.trim()
            }
            isEditPage
            params={decodedParams}
          />
          <Flex flexDir="row" w="100%" h="100%" alignItems="flex-start">
            {/* Editor */}
            {children}
          </Flex>
          <Spacer />
          <Footer>
            <Button onClick={onSave} isLoading={isSavingPage}>
              Save
            </Button>
          </Footer>
        </Flex>
      </Greyscale>
    </>
  )
}
