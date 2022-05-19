import { Input } from "@opengovsg/design-system-react"
import PropTypes from "prop-types"
import { forwardRef } from "react"

import { useFormContext } from "./FormContext"

// NOTE: Read about forwardRef here: https://reactjs.org/docs/forwarding-refs.html
// We do this to pass refs properly rather than just prop threading
const FormInput = forwardRef(
  (
    {
      value,
      id,
      placeholder = "",
      // NOTE: We require this prop because some usage of formInput is not interactive.
      // This means that even if the form itself is active,
      // the input itself is used purely for conveying visual info and is still disabled.
      alwaysDisabled = false,
      // NOTE: This should conform as closely as possible to an actual input.
      // Hence, the returned values from register are passed here rather than having a register prop.
      // This also helps ambiguous situations where onChange and register are both passed.
      // Refer here for info on register: https://react-hook-form.com/api/useform/register
      onChange = () => {},
      onBlur = () => {},
      name = "",
    },
    ref
  ) => {
    const { isRequired, hasError, isDisabled } = useFormContext()

    return (
      <Input
        type="text"
        placeholder={placeholder}
        isInvalid={hasError}
        value={value}
        id={id}
        autoComplete="off"
        required={isRequired}
        isDisabled={alwaysDisabled || isDisabled}
        onChange={onChange}
        onBlur={onBlur}
        name={name}
        ref={ref}
      />
    )
  }
)

FormInput.propTypes = {
  value: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  alwaysDisabled: PropTypes.bool,
  onChange: PropTypes.func,
  onBlur: PropTypes.func,
  name: PropTypes.string,
}

export default FormInput
