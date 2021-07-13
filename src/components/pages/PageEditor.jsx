import React from "react"
import SimpleMDE from "react-simplemde-editor"
import editorStyles from "../../styles/isomer-cms/pages/Editor.module.scss"
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
} from "../../utils/markdownToolbar"

const PageEditor = ({ mdeRef, onChange, value, customOptions, isDisabled }) => {
  return (
    <div
      className={`${editorStyles.pageEditorSidebar} ${
        !value || isDisabled ? editorStyles.pageEditorSidebarLoading : null
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
      ) : !value ? (
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
              action: customOptions.imageAction,
              className: "fa fa-picture-o",
              title: "Insert Image",
              default: true,
            },
            {
              name: "file",
              action: customOptions.fileAction,
              className: "fa fa-file-pdf-o",
              title: "Insert File",
              default: true,
            },
            {
              name: "link",
              action: customOptions.linkAction,
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
  )
}

export default PageEditor
