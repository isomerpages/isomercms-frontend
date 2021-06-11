import React from "react"
import InputMask from "react-input-mask"

import PropTypes from "prop-types"

import elementStyles from "@styles/isomer-cms/Elements.module.scss"

const InputMaskFormField = ({
  title,
  value,
  mask,
  maskChar,
  alwaysShowMask,
  id,
  hasError,
  errorMessage,
  onFieldChange,
  style,
  disabled,
  fixedMessage,
  maxWidth,
}) => (
  <>
    {title && <label className={elementStyles.formLabel}>{title}</label>}
    <div className={`d-flex text-nowrap ${maxWidth ? "w-100" : ""}`}>
      {fixedMessage && (
        <p className={elementStyles.formFixedText}>{fixedMessage}</p>
      )}
      <InputMask
        mask={mask}
        maskChar={maskChar}
        alwaysShowMask={alwaysShowMask}
        id={id}
        value={value}
        style={style}
        onChange={onFieldChange}
        className={hasError || errorMessage ? `${elementStyles.error}` : null}
        disabled={disabled}
      />
    </div>
    {errorMessage && (
      <span className={elementStyles.error}>{errorMessage}</span>
    )}
  </>
)

export default InputMaskFormField

InputMaskFormField.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string.isRequired,
  mask: PropTypes.string.isRequired,
  maskChar: PropTypes.string,
  alwaysShowMask: PropTypes.bool,
  id: PropTypes.string.isRequired,
  hasError: PropTypes.bool,
  errorMessage: PropTypes.string,
  onFieldChange: PropTypes.func.isRequired,
  isRequired: PropTypes.bool,
  style: PropTypes.string,
  maxWidth: PropTypes.bool,
}

InputMaskFormField.defaultProps = {
  style: undefined,
  errorMessage: null,
}
