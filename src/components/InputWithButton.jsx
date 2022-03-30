import cx from "classnames"
import React from "react"
import PropTypes from "prop-types"
import elementStyles from "../styles/isomer-cms/Elements.module.scss"

const InputWithButton = ({
  type,
  placeholder,
  value,
  onChange,
  buttonText,
  loadingText,
  isLoading,
  isDisabled,
}) => (
  <div className={elementStyles.formInputWithButton}>
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
    />
    <button
      type="submit"
      className={cx(elementStyles.green, {
        [elementStyles.disabled]: isDisabled,
      })}
      disabled={isDisabled}
    >
      {isLoading ? loadingText : buttonText}
    </button>
  </div>
)

InputWithButton.defaultProps = {
  type: "text",
  placeholder: "",
  buttonText: "Submit",
  loadingText: "Loading",
  isLoading: false,
  isDisabled: false,
}

InputWithButton.propTypes = {
  type: PropTypes.string,
  placeholder: PropTypes.string,
  value: PropTypes.string.isRequired,
  loadingText: PropTypes.string,
  buttonText: PropTypes.string,
  onChange: PropTypes.func.isRequired,
  isLoading: PropTypes.bool,
  isDisabled: PropTypes.bool,
}

export default InputWithButton
