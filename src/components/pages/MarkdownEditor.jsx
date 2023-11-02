import { Box } from "@chakra-ui/react"
import { useMemo, useState, useCallback } from "react"
import SimpleMDE from "react-simplemde-editor"

import EditorModals from "components/pages/EditorModals"

import { useMarkdown } from "hooks/useMarkdown"

import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

import {
  boldButton,
  italicButton,
  strikethroughButton,
  headingButton,
  codeButton,
  quoteButton,
  unorderedListButton,
  orderedListButton,
  tableButton,
  guideButton,
} from "utils/markdownToolbar"

const MarkdownEditor = ({ siteName, onChange, value, isLoading }) => {
  const [editorModalType, setEditorModalType] = useState("")
  const [insertingMediaType, setInsertingMediaType] = useState("")
  const { toMarkdown } = useMarkdown()
  const options = useMemo(
    () => ({
      autoRefresh: true,
      styleSelectedText: true,
      toolbar: [
        headingButton,
        boldButton,
        italicButton,
        strikethroughButton,
        "|",
        codeButton,
        quoteButton,
        unorderedListButton,
        orderedListButton,
        "|",
        {
          name: "image",
          action: async () => {
            setEditorModalType("media")
            setInsertingMediaType("images")
          },
          className: "fa fa-picture-o",
          title: "Insert Image",
          default: true,
        },
        {
          name: "file",
          action: async () => {
            setEditorModalType("media")
            setInsertingMediaType("files")
          },
          className: "fa fa-file-pdf-o",
          title: "Insert File",
          default: true,
        },
        {
          name: "link",
          action: async () => {
            setEditorModalType("hyperlink")
          },
          className: "fa fa-link",
          title: "Insert Link",
          default: true,
        },
        tableButton,
        guideButton,
      ],
    }),
    [editorModalType, insertingMediaType]
  )
  const events = useMemo(() => {
    return {
      paste: (cm, e) => {
        const convertedText = toMarkdown(e.clipboardData.getData("text/html"))

        // If parsing the text results in valid markdown, prefer the markdown text.
        // Otherwise, just go with the default paste.
        // This works with Ctrl-Shift-V as the OS sanitizes the string prior to paste
        if (convertedText) {
          e.preventDefault()
          cm.replaceSelection(convertedText)
        }
      },
    }
  })

  const [simpleMdeInstance, setMdeInstance] = useState(null)

  const getMdeInstanceCallback = useCallback((simpleMde) => {
    setMdeInstance(simpleMde)
  }, [])

  const [lineAndCursor, setLineAndCursor] = useState(null)

  const getLineAndCursorCallback = useCallback((position) => {
    setLineAndCursor(position)
  }, [])

  const StatusIcon = () => {
    if (isLoading) {
      return (
        <div
          className={`spinner-border text-primary ${editorStyles.sidebarLoadingIcon}`}
        />
      )
    }

    return null
  }

  return (
    // NOTE: This is overflowing
    <Box h="100%" overflowY="auto">
      <EditorModals
        siteName={siteName}
        modalType={editorModalType}
        onSave={onChange}
        onClose={() => {
          setEditorModalType("")
          setInsertingMediaType("")
        }}
        mediaType={insertingMediaType}
        simpleMde={simpleMdeInstance}
        lineAndCursor={lineAndCursor}
      />
      <div
        className={`${editorStyles.pageEditorSidebar} ${
          isLoading ? editorStyles.pageEditorSidebarLoading : ""
        }`}
      >
        <StatusIcon />
        <SimpleMDE
          id="simplemde-editor"
          onChange={onChange}
          value={value}
          options={options}
          events={events}
          getMdeInstance={getMdeInstanceCallback}
          getLineAndCursor={getLineAndCursorCallback}
        />
      </div>
    </Box>
  )
}

export default MarkdownEditor
