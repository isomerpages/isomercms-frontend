import PropTypes from "prop-types"
import React from "react"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

const FormFieldColor = ({
  title,
  defaultValue,
  value,
  id,
  onFieldChange,
  onColorClick,
  isRequired,
  style,
}) => (
  <>
    <div className={elementStyles.formColor}>
      <p className={elementStyles.formColorLabel}>{title}</p>
      <input
        type="text"
        placeholder={title}
        value={value}
        defaultValue={defaultValue}
        id={id}
        autoComplete="off"
        required={isRequired}
        className={elementStyles.formColorInput}
        style={style}
        onChange={onFieldChange}
        disabled
      />
      <div
        className={elementStyles.formColorBox}
        style={{ background: value }}
        onClick={onColorClick}
      />
    </div>
    {/* <span className={elementStyles.error}>{errorMessage}</span> */}
  </>
)

export default FormFieldColor

FormFieldColor.propTypes = {
  title: PropTypes.string.isRequired,
  defaultValue: PropTypes.string,
  value: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  onFieldChange: PropTypes.func.isRequired,
  onColorClick: PropTypes.func.isRequired,
  isRequired: PropTypes.bool.isRequired,
  style: PropTypes.string,
}

FormFieldColor.defaultProps = {
  defaultValue: undefined,
  style: undefined,
}
