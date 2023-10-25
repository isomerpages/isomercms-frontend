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
import DOMPurify from "dompurify"
import _ from "lodash"
import { marked } from "marked"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Markdown } from "tiptap-markdown"

import MarkdownEditor from "components/pages/MarkdownEditor"
import PagePreview from "components/pages/PagePreview"

import { EditorContextProvider } from "contexts/EditorContext"
import { EditorModalContextProvider } from "contexts/EditorModalContext"

import { useGetMultipleMediaHook } from "hooks/mediaHooks"
import { useGetPageHook } from "hooks/pageHooks"
import { useCspHook } from "hooks/settingsHooks"

import { Editor } from "layouts/components/Editor"
import Iframe from "layouts/components/Editor/Iframe"

// Isomer utils
import checkCSP from "utils/cspUtils"

import { getMediaSrcsFromHtml, adjustImageSrcs, getDecodedParams } from "utils"

import "easymde/dist/easymde.min.css"
import { EditPageLayout } from "./EditPageLayout"

// axios settings
axios.defaults.withCredentials = true

DOMPurify.setConfig({
  ADD_TAGS: ["iframe", "#comment", "script"],
  ADD_ATTR: [
    "allow",
    "allowfullscreen",
    "frameborder",
    "scrolling",
    "marginheight",
    "marginwidth",
    "target",
    "async",
  ],
  // required in case <script> tag appears as the first line of the markdown
  FORCE_BODY: true,
})
DOMPurify.addHook("uponSanitizeElement", (node, data) => {
  // Allow script tags if it has a src attribute
  // Script sources are handled by our CSP sanitiser
  if (
    data.tagName === "script" &&
    !(node.hasAttribute("src") && node.innerHTML === "")
  ) {
    // Adapted from https://github.com/cure53/DOMPurify/blob/e0970d88053c1c564b6ccd633b4af7e7d9a10375/src/purify.js#L719-L736
    DOMPurify.removed.push({ element: node })
    try {
      node.parentNode?.removeChild(node)
    } catch (e) {
      try {
        // eslint-disable-next-line no-param-reassign
        node.outerHTML = ""
      } catch (ex) {
        node.remove()
      }
    }
  }
})

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

  const previewModalProps = useDisclosure()

  const { data: csp } = useCspHook()

  const updateMediaSrcs = () => {
    if (!csp || _.isEmpty(csp) || !editorValue) return
    const html = marked.parse(editorValue)
    const { sanitisedHtml: CSPSanitisedHtml } = checkCSP(csp, html)
    const DOMCSPSanitisedHtml = DOMPurify.sanitize(CSPSanitisedHtml)
    setMediaSrcs(getMediaSrcsFromHtml(DOMCSPSanitisedHtml))
  }

  const updateHtmlWithMediaData = () => {
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
  }

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
  }, [csp, editorValue])

  useEffect(() => {
    updateHtmlWithMediaData()
  }, [mediaData, editorValue])

  return (
    <EditPageLayout getPageBody={() => editorValue} variant="markdown">
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
            onClick={previewModalProps.onOpen}
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
        title={initialPageData?.content?.frontMatter?.title || ""}
        chunk={htmlChunk}
      />

      <PreviewModal
        {...previewModalProps}
        content={editorValue}
        togglePreview={togglePreview}
      />
    </EditPageLayout>
  )
}

interface PreviewModalProps {
  isOpen: boolean
  onClose: () => void
  content: string
  togglePreview: () => void
}
const PreviewModal = ({
  isOpen,
  onClose,
  content,
  togglePreview,
}: PreviewModalProps) => {
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
    content,
  })

  useEffect(() => {
    editor?.commands.setContent(content)
  }, [content, editor?.commands])

  if (!editor) return null

  return (
    <EditorContextProvider editor={editor}>
      <EditorModalContextProvider showModal={console.log}>
        <Modal isOpen={isOpen} onClose={onClose} size="xl">
          <ModalOverlay />
          <ModalContent p="1rem">
            <ModalHeader>
              <Text textStyle="h3">New editing preview</Text>
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Editor maxW="100%" p="0" />
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
      </EditorModalContextProvider>
    </EditorContextProvider>
  )
}
