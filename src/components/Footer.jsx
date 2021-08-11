import React from "react"
import PropTypes from "prop-types"

import editorStyles from "../styles/isomer-cms/pages/Editor.module.scss"
import elementStyles from "../styles/isomer-cms/Elements.module.scss"

import LoadingButton from "./LoadingButton"

const Footer = ({
  isDeleteDisabled,
  isSaveDisabled,
  deleteCallback,
  saveCallback,
}) => (
  <div className={editorStyles.pageEditorFooter}>
    {deleteCallback ? (
      <button
        type="button"
        className={elementStyles.warning}
        onClick={deleteCallback}
        disabled={isDeleteDisabled}
      >
        Delete
      </button>
    ) : null}
    {saveCallback ? (
      <LoadingButton
        label="Save"
        disabledStyle={elementStyles.disabled}
        disabled={isSaveDisabled}
        className={isSaveDisabled ? elementStyles.disabled : elementStyles.blue}
        callback={saveCallback}
      />
    ) : null}
  </div>
)

Footer.propTypes = {
  isDeleteDisabled: PropTypes.bool,
  isSaveDisabled: PropTypes.bool,
  deleteCallback: PropTypes.func,
  saveCallback: PropTypes.func,
}

export default Footer
