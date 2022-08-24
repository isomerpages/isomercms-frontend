import EditorModals from "components/pages/EditorModals"
import { useMemo, useState } from "react"
import SimpleMDE from "react-simplemde-editor"

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

import { processInstagramEmbedToTag } from "utils"

const MarkdownEditor = ({
  siteName,
  mdeRef,
  onChange,
  value,
  isDisabled,
  isLoading,
}) => {
  const [editorModalType, setEditorModalType] = useState("")
  const [insertingMediaType, setInsertingMediaType] = useState("")
  const { toMarkdown } = useMarkdown()
  const options = useMemo(
    () => ({
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
        {
          name: "instagram",
          action: async () => {
            setEditorModalType("instagram")
          },
          className: "fa fa-instagram",
          title: "Insert Instagram post",
          default: true,
        },
        guideButton,
      ],
    }),
    [editorModalType, insertingMediaType]
  )
  const events = useMemo(() => {
    return {
      paste: (cm, e) => {
        const pasteText = e.clipboardData.getData("text/plain")
        const processedPasteText = processInstagramEmbedToTag(pasteText)

        // If the paste text contains an Instagram embed, replace the paste text
        // with the processed paste text.
        // Note: This will prevent further processing of the paste text, as
        // custom HTML tags will be removed by Turndown
        if (processedPasteText !== pasteText) {
          e.preventDefault()
          cm.replaceSelection(processedPasteText)
          return
        }

        const convertedText = toMarkdown(pasteText)

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

  const StatusIcon = () => {
    if (isDisabled) {
      return (
        <div
          className={`text-center ${editorStyles.pageEditorSidebarDisabled}`}
        >
          Editing is disabled for downloadable files.
        </div>
      )
    }

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
    <>
      <EditorModals
        siteName={siteName}
        mdeRef={mdeRef}
        modalType={editorModalType}
        onSave={onChange}
        onClose={() => {
          setEditorModalType("")
          setInsertingMediaType("")
        }}
        mediaType={insertingMediaType}
      />
      <div
        className={`${editorStyles.pageEditorSidebar} ${
          isLoading || isDisabled ? editorStyles.pageEditorSidebarLoading : null
        }`}
      >
        <StatusIcon />
        <SimpleMDE
          id="simplemde-editor"
          className="h-100"
          onChange={onChange}
          ref={mdeRef}
          value={value}
          options={options}
          events={events}
        />
      </div>
    </>
  )
}

export default MarkdownEditor
