import PropTypes from "prop-types"
import React from "react"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

const FormField = ({
  title,
  defaultValue,
  value,
  id,
  hasError,
  errorMessage,
  onFieldChange,
  isRequired,
  style,
  placeholder,
  disabled,
  fixedMessage,
  maxWidth,
  children,
  register = () => {},
}) => (
  <div>
    {title && <label className={elementStyles.formLabel}>{title}</label>}
    {children}
    <div className={`d-flex text-nowrap ${maxWidth ? "w-100" : ""}`}>
      {fixedMessage && (
        <p className={elementStyles.formFixedText}>{fixedMessage}</p>
      )}
      <input
        type="text"
        placeholder={placeholder || title}
        value={value}
        defaultValue={defaultValue}
        id={id}
        autoComplete="off"
        required={isRequired}
        className={hasError || errorMessage ? `${elementStyles.error}` : null}
        style={style}
        onChange={onFieldChange}
        {...register(id, { required: isRequired })}
        disabled={disabled}
      />
    </div>
    {errorMessage && (
      <span className={elementStyles.error}>{errorMessage}</span>
    )}
  </div>
)

export default FormField

FormField.propTypes = {
  title: PropTypes.string,
  defaultValue: PropTypes.string,
  value: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  errorMessage: PropTypes.string,
  onFieldChange: PropTypes.func.isRequired,
  isRequired: PropTypes.bool,
  style: PropTypes.string,
  maxWidth: PropTypes.bool,
}

FormField.defaultProps = {
  defaultValue: undefined,
  style: undefined,
  errorMessage: null,
}
