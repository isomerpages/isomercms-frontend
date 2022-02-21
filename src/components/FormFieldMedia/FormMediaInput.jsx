import PropTypes from "prop-types"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

import { useFormContext } from "../Form/FormContext"
import FormInput from "../Form/FormInput"

const FormMediaInput = ({
  placeholder = "",
  value,
  register = () => {},
  id,
  onClick = () => {},
  inlineButtonText = "Choose Item",
}) => {
  const { isRequired, isDisabled } = useFormContext()

  return (
    <div className="d-flex">
      <FormInput
        placeholder={placeholder}
        value={value}
        id={id}
        alwaysDisabled
        className="border-1"
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
