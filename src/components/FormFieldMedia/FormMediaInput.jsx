import PropTypes from "prop-types"
import React from "react"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

import { useFormContext } from "../Form/FormContext"

const FormMediaInput = ({
  placeholder = "",
  value,
  register = () => {},
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
        id={id}
        autoComplete="off"
        required={isRequired}
        className={hasError ? `${elementStyles.error}` : "border-0"}
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
  value: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  register: PropTypes.func,
  onClick: PropTypes.func,
  inlineButtonText: PropTypes.string,
}

export default FormMediaInput
