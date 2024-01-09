import {
  useDisclosure,
  Text,
  Box,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Icon,
} from "@chakra-ui/react"
import { Button, Infobox } from "@opengovsg/design-system-react"
import axios from "axios"
import DOMPurify from "dompurify"
import _ from "lodash"
import { marked } from "marked"
import { useCallback, useEffect, useState } from "react"
import { BiSolidInfoCircle } from "react-icons/bi"
import { useParams } from "react-router-dom"

import MarkdownEditor from "components/pages/MarkdownEditor"
import PagePreview from "components/pages/PagePreview"

import { useEditorContext } from "contexts/EditorContext"
import { useEditorDrawerContext } from "contexts/EditorDrawerContext"

import { useGetMultipleMediaHook } from "hooks/mediaHooks"
import { useGetPageHook } from "hooks/pageHooks"
import { useCspHook } from "hooks/settingsHooks"

import { Editor } from "layouts/components/Editor"

// Isomer utils
import checkCSP from "utils/cspUtils"

import { getMediaSrcsFromHtml, adjustImageSrcs, getDecodedParams } from "utils"

import "easymde/dist/easymde.min.css"
import { EditPageLayout } from "./EditPageLayout"

// axios settings
axios.defaults.withCredentials = true

interface MarkdownPageProps {
  togglePreview: () => void
}
export const MarkdownEditPage = ({ togglePreview }: MarkdownPageProps) => {
  const params = useParams<{ siteName: string }>()
  const decodedParams = getDecodedParams(params)
  const { data: initialPageData, isLoading: isLoadingPage } = useGetPageHook(
    params
  )
  const { siteName } = decodedParams

  const [editorValue, setEditorValue] = useState("")
  const [htmlChunk, setHtmlChunk] = useState("")
  const [mediaSrcs, setMediaSrcs] = useState(new Set<string>(""))
  const [currSha, setCurrSha] = useState("")
  const [hasChanges, setHasChanges] = useState(false)
  const { data: mediaData } = useGetMultipleMediaHook({
    siteName,
    mediaSrcs,
  })
  const { editor } = useEditorContext()

  const { onOpen, onClose, ...rest } = useDisclosure()

  const { data: csp } = useCspHook()

  const updateMediaSrcs = useCallback(() => {
    if (!csp || _.isEmpty(csp) || !editorValue) return
    const html = marked.parse(editorValue)
    const { sanitisedHtml: CSPSanitisedHtml } = checkCSP(csp, html)
    const DOMCSPSanitisedHtml = DOMPurify.sanitize(CSPSanitisedHtml)
    setMediaSrcs(getMediaSrcsFromHtml(DOMCSPSanitisedHtml))
  }, [csp, editorValue])

  const updateHtmlWithMediaData = useCallback(() => {
    if (!csp || _.isEmpty(csp) || !editorValue) return
    const html = marked.parse(editorValue)
    const {
      isCspViolation: checkedIsCspViolation,
      sanitisedHtml: CSPSanitisedHtml,
    } = checkCSP(csp, html)
    const DOMCSPSanitisedHtml = DOMPurify.sanitize(CSPSanitisedHtml)
    const processedChunk = adjustImageSrcs(DOMCSPSanitisedHtml, mediaData || [])

    // Using FORCE_BODY adds a fake <remove></remove>
    DOMPurify.removed = DOMPurify.removed.filter(
      (el) => el.element?.tagName !== "REMOVE"
    )

    // NOTE: Not removing as we are adding this back soon.
    // However, do take note that this should be
    // added back into `EditPageLayout` and not here.
    // setIsXSSViolation(DOMPurify.removed.length > 0)
    // setIsContentViolation(checkedIsCspViolation)
    setHtmlChunk(processedChunk)
  }, [csp, editorValue, mediaData])

  useEffect(() => {
    if (initialPageData && !hasChanges) {
      setEditorValue(initialPageData.content.pageBody.trim())
      setCurrSha(initialPageData.sha)
    }
  }, [hasChanges, initialPageData])

  useEffect(() => {
    if (initialPageData)
      setHasChanges(initialPageData.content.pageBody.trim() !== editorValue)
  }, [initialPageData, editorValue])

  useEffect(() => {
    updateMediaSrcs()
  }, [csp, editorValue, updateMediaSrcs])

  useEffect(() => {
    updateHtmlWithMediaData()
  }, [mediaData, editorValue, updateHtmlWithMediaData])

  const { isAnyDrawerOpen } = useEditorDrawerContext()

  return (
    <EditPageLayout
      variant="markdown"
      getEditorContent={() => editorValue}
      setEditorContent={(content: string) => setEditorValue(content)}
      shouldDisableSave={isAnyDrawerOpen}
    >
      <Box flex="0 0 45vw" p="1.25rem" overflow="auto">
        <Flex
          flexDir="row"
          bg="utility.feedback.info-subtle"
          p="1.38rem"
          mb="1.38rem"
          gap="0.5rem"
        >
          <Flex flexDir="column" alignContent="center">
            <Icon
              as={BiSolidInfoCircle}
              fontSize="1.25rem"
              color="icon.default"
            />
          </Flex>
          <Flex flexDir="column" alignContent="flex-start" mr="1rem">
            <Text>
              This editor will be on maintenance mode from{" "}
              <b>March 1st, 2024</b>.
            </Text>
            <Text>
              Try Isomer’s new editor and edit pages without writing any code.
              Preview this page on the new editor before switching.
            </Text>
          </Flex>
          <Spacer />
          <Button
            variant="outline"
            alignSelf="center"
            onClick={() => {
              // NOTE: Set initial content to the markdown content first
              editor.commands.setContent(editorValue)
              onOpen()
            }}
          >
            Preview page
          </Button>
        </Flex>
        <MarkdownEditor
          siteName={siteName}
          onChange={(value: string) => setEditorValue(value)}
          value={editorValue}
          isLoading={isLoadingPage}
        />
      </Box>

      {/* Preview */}
      <PagePreview
        h="calc(100vh - 0.5rem)"
        flex="1 0"
        title={initialPageData?.content?.frontMatter?.title || ""}
        chunk={htmlChunk}
      />

      <PreviewModal
        onClose={() => {
          onClose()
          // NOTE: Reset back to what was previously fetched
          editor.commands.setContent(initialPageData?.content?.pageBody.trim())
        }}
        {...rest}
        togglePreview={togglePreview}
      />
    </EditPageLayout>
  )
}

interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
  togglePreview: () => void
}
const PreviewModal = ({
  isOpen,
  onClose,
  togglePreview,
}: PreviewModalProps) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent p="1rem">
        <ModalHeader>
          <Text textStyle="h3">Preview Isomer’s new editor</Text>
        </ModalHeader>
        <ModalCloseButton top="1.5rem" insetEnd="2rem" />
        <ModalBody>
          <Text mb="1.5rem">
            We’re introducing a new editor on IsomerCMS. Using this editor, you
            can edit pages without using any Markdown or HTML. Explore what your
            content looks like on the new editor.
          </Text>
          <Text>
            You can toggle to use the new editor anytime on Page Settings.
          </Text>
          <Infobox my="1.5rem" variant="warning">
            <Text>
              The current editor will be phased out by{" "}
              <Text as="span" fontWeight="bold">
                Q2 2024
              </Text>
              .
            </Text>
          </Infobox>
          <Editor maxW="100%" p="0" />
        </ModalBody>
        <ModalFooter>
          <Button variant="clear" mr={3} onClick={onClose}>
            I&apos;ll explore later
          </Button>
          <Button colorScheme="blue" onClick={togglePreview}>
            Use new editor on this page
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
