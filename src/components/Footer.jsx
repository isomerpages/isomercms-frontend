import React from "react"
import PropTypes from "prop-types"

import editorStyles from "../styles/isomer-cms/pages/Editor.module.scss"
import elementStyles from "../styles/isomer-cms/Elements.module.scss"

import Button from "./Button"

const Footer = ({
  keyButtonText,
  keyCallback,
  isKeyButtonDisabled,
  keyButtonIsLoading,
  optionalButtonText,
  optionalCallback,
  isOptionalButtonDisabled,
  optionalButtonIsLoading,
}) => (
  <div className={editorStyles.pageEditorFooter}>
    {optionalCallback ? (
      <Button
        label={optionalButtonText}
        disabledStyle={elementStyles.disabled}
        disabled={isOptionalButtonDisabled}
        className={
          isOptionalButtonDisabled
            ? elementStyles.disabled
            : elementStyles.warning
        }
        callback={optionalCallback}
        isLoading={optionalButtonIsLoading}
      />
    ) : null}
    {keyCallback ? (
      <Button
        label={keyButtonText}
        disabledStyle={elementStyles.disabled}
        disabled={isKeyButtonDisabled}
        className={
          isKeyButtonDisabled ? elementStyles.disabled : elementStyles.blue
        }
        callback={keyCallback}
        isLoading={keyButtonIsLoading}
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
