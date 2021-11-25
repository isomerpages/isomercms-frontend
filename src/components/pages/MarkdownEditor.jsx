import React, { useState } from "react"
import SimpleMDE from "react-simplemde-editor"

import EditorModals from "components/pages/EditorModals"

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
        insertingMediaType={insertingMediaType}
      />
      <div
        className={`${editorStyles.pageEditorSidebar} ${
          isLoading || isDisabled ? editorStyles.pageEditorSidebarLoading : null
        }`}
      >
        {isDisabled ? (
          <>
            <div
              className={`text-center ${editorStyles.pageEditorSidebarDisabled}`}
            >
              Editing is disabled for downloadable files.
            </div>
          </>
        ) : isLoading ? (
          <div
            className={`spinner-border text-primary ${editorStyles.sidebarLoadingIcon}`}
          />
        ) : (
          ""
        )}
        <SimpleMDE
          id="simplemde-editor"
          className="h-100"
          onChange={onChange}
          ref={mdeRef}
          value={value}
          options={{
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
          }}
        />
      </div>
    </>
  )
}

export default MarkdownEditor
