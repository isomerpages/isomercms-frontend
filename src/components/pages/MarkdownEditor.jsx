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
