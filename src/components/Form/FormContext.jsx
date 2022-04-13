import PropTypes from "prop-types"
import { createContext, useContext } from "react"

const FormControlContext = createContext(undefined)

// This context holds shared state between the various sub-components of the form.
// State is held here to avoid prop-threading and to ensure that the leaf components
// only have display logic associated with them.
const FormContext = ({
  onFieldChange = () => {},
  hasError = false,
  isRequired = false,
  isDisabled = false,
  children,
}) => {
  return (
    <FormControlContext.Provider
      value={{ hasError, onFieldChange, isRequired, isDisabled }}
    >
      {children}
    </FormControlContext.Provider>
  )
}

export const useFormContext = () => {
  const formContext = useContext(FormControlContext)
  if (!formContext) {
    throw new Error("useFormContext must be called within a FormContext!")
  }
  return formContext
}

FormContext.propTypes = {
  onFieldChange: PropTypes.func,
  hasError: PropTypes.bool,
  isRequired: PropTypes.bool,
  isDisabled: PropTypes.bool,
  children: PropTypes.node,
}
export default FormContext
