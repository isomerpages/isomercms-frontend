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
} from "@chakra-ui/react"
import { Button, Infobox } from "@opengovsg/design-system-react"
import axios from "axios"
import DOMPurify from "dompurify"
import _ from "lodash"
import { marked } from "marked"
import { useCallback, useEffect, useState } from "react"
import { useParams } from "react-router-dom"

import MarkdownEditor from "components/pages/MarkdownEditor"
import PagePreview from "components/pages/PagePreview"

import { useEditorContext } from "contexts/EditorContext"

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

  return (
    <EditPageLayout
      variant="markdown"
      getEditorContent={() => editorValue}
      setEditorContent={(content: string) => setEditorValue(content)}
    >
      <Box maxW="50%" p="1.25rem">
        <Flex flexDir="row" bg="gray.100" p="1.38rem" mb="1.38rem">
          <Flex flexDir="column" alignContent="flex-start" mr="1rem">
            <Text textStyle="subhead-1" mb="0.62rem">
              🎉 We’re introducing a new editor on Isomer!
            </Text>
            <Text>
              With the new editor, you can edit pages without any HTML/Markdown.
              Preview what your page might look like before making the shift.
            </Text>
          </Flex>
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
        w="62.5rem"
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
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent p="1rem">
        <ModalHeader>
          <Text textStyle="h3">New editing preview</Text>
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <Editor maxW="100%" p="0" />
          <Infobox mt="1rem" variant="warning">
            Changes you make here will reflect on the new editor if you use the
            new one!
          </Infobox>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme="red" mr={3} onClick={onClose}>
            Close
          </Button>
          <Button colorScheme="blue" onClick={togglePreview}>
            I&apos;m in!
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
