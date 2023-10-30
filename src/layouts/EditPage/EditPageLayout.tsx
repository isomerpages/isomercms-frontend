import {
  Flex,
  Spacer,
  Button,
  useDisclosure,
  Box,
  Code,
  Text,
} from "@chakra-ui/react"
import { AxiosError } from "axios"
import DOMPurify from "dompurify"
import _ from "lodash"
import { marked } from "marked"
import { PropsWithChildren, useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import { Footer } from "components/Footer"
import { Greyscale } from "components/Greyscale"
import Header from "components/Header"
import { OverwriteChangesModal } from "components/OverwriteChangesModal"
import { WarningModal } from "components/WarningModal"

import { useGetMultipleMediaHook } from "hooks/mediaHooks"
import { useGetPageHook, useUpdatePageHook } from "hooks/pageHooks"
import { useCspHook, useGetSiteColorsHook } from "hooks/settingsHooks"
import useRedirectHook from "hooks/useRedirectHook"

import { isWriteActionsDisabled } from "utils/reviewRequests"

import { PageVariant } from "types/pages"
import { createPageStyleSheet, getDecodedParams } from "utils"

import { sanitiseRawHtml, updateHtmlWithMediaData } from "./utils"

interface EditPageLayoutProps {
  getEditorContent: () => string
  setEditorContent: (content: string) => void
  variant: PageVariant
}

export const EditPageLayout = ({
  getEditorContent,
  setEditorContent,
  variant = "markdown",
  children,
}: PropsWithChildren<EditPageLayoutProps>) => {
  const params = useParams<{ siteName: string }>()
  const decodedParams = getDecodedParams(params)
  const [mediaSrcs, setMediaSrcs] = useState(new Set(""))

  const {
    isOpen: isOverwriteOpen,
    onOpen: onOverwriteOpen,
    onClose: onOverwriteClose,
  } = useDisclosure()
  const { data: csp } = useCspHook()
  const {
    mutateAsync: updatePageHandler,
    isLoading: isSavingPage,
  } = useUpdatePageHook(params, {
    onSuccess: (data: {
      content: {
        pageBody: string
      }
    }) => {
      setEditorContent(data?.content?.pageBody)
    },
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
  const { data: mediaData } = useGetMultipleMediaHook({
    siteName,
    mediaSrcs,
  })
  const [isContentViolation, setIsContentViolation] = useState(false)
  const [isXSSViolation, setIsXSSViolation] = useState(false)
  const {
    isOpen: isXSSWarningModalOpen,
    onOpen: onXSSWarningModalOpen,
    onClose: onXSSWarningModalClose,
  } = useDisclosure()

  const isWriteDisabled = isWriteActionsDisabled(siteName)
  const editorContent = getEditorContent()

  useEffect(() => {
    if (!csp || _.isEmpty(csp) || !editorContent) return

    const isLegacyPage = variant === "markdown" || !variant
    const html = isLegacyPage ? marked.parse(editorContent) : editorContent
    const { sanitisedHtml } = sanitiseRawHtml(csp, html)

    const {
      html: processedChunk,
      isXssViolation,
      isContentViolation: isCspViolation,
    } = updateHtmlWithMediaData(mediaSrcs, sanitisedHtml, mediaData)

    setIsXSSViolation(isXssViolation)
    setIsContentViolation(isCspViolation)
  }, [mediaData, csp, mediaSrcs, onXSSWarningModalOpen, editorContent, variant])

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

      <WarningModal
        isOpen={isXSSViolation && isXSSWarningModalOpen}
        onClose={onXSSWarningModalClose}
        displayTitle="Warning"
        // DOMPurify removed object format taken from https://github.com/cure53/DOMPurify/blob/dd63379e6354f66d4689bb80b30cb43a6d8727c2/src/purify.js
        displayText={
          <Box>
            <Text>
              There is unauthorised JS detected in the following snippet
              {DOMPurify.removed.length > 1 ? "s" : ""}:
            </Text>
            {DOMPurify.removed.map((elem, i) => (
              <>
                <br />
                <Code>{i + 1}</Code>:
                <Code>
                  {elem.attribute?.nodeName || elem.element?.outerHTML || elem}
                </Code>
              </>
            ))}
            <br />
            <br />
            Before saving, the editor input will be automatically sanitised to
            prevent security vulnerabilities.
            <br />
            <br />
            To save the sanitised editor input, press Acknowledge. To return to
            the editor without sanitising, press Cancel.
          </Box>
        }
      >
        <Button colorScheme="critical" onClick={onXSSWarningModalClose}>
          Cancel
        </Button>
        <Button
          onClick={() => {
            setIsXSSViolation(false)
            onSave()
            onXSSWarningModalClose()
          }}
        >
          Acknowledge
        </Button>
      </WarningModal>

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
            <Button
              onClick={() => {
                if (isXSSViolation) onXSSWarningModalOpen()
                else onSave()
              }}
              // TODO: Add an alert/modal
              // to warn the user when they violate our csp
              // so they know why + can take action to remedy
              isDisabled
              isLoading={isSavingPage}
            >
              Save
            </Button>
          </Footer>
        </Flex>
      </Greyscale>
    </>
  )
}
