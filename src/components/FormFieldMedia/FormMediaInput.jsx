import PropTypes from "prop-types"
import React from "react"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

import { useFormContext } from "../Form/FormContext"

const FormMediaInput = ({
  placeholder = "",
  defaultValue = undefined,
  value,
  register = () => {},
  style = undefined,
  id,
  onClick = () => {},
  inlineButtonText = "Choose Item",
}) => {
  const { isRequired, hasError, isDisabled } = useFormContext()

  return (
    <div className="d-flex border">
      <input
        type="text"
        placeholder={placeholder}
        value={value}
        defaultValue={defaultValue}
        id={id}
        autoComplete="off"
        required={isRequired}
        className={hasError ? `${elementStyles.error}` : "border-0"}
        style={style}
        disabled
        {...register(id, { required: isRequired })}
      />
      {inlineButtonText && (
        <button
          type="button"
          className={`${
            isDisabled ? elementStyles.disabled : elementStyles.blue
          } text-nowrap`}
          onClick={onClick}
          disabled={isDisabled}
        >
          {inlineButtonText}
        </button>
      )}
    </div>
  )
}

FormMediaInput.propTypes = {
  defaultValue: PropTypes.string,
  value: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  register: PropTypes.func,
  style: PropTypes.string,
  onClick: PropTypes.func,
  inlineButtonText: PropTypes.string,
}

export default FormMediaInput
