import PropTypes from "prop-types"
import React from "react"

import Button from "components/Button"

import elementStyles from "styles/isomer-cms/Elements.module.scss"
import editorStyles from "styles/isomer-cms/pages/Editor.module.scss"

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
