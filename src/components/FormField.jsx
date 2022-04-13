import PropTypes from "prop-types"
import { forwardRef } from "react"

import FormInput from "./Form/FormInput"

// NOTE: Read about forwardRef here: https://reactjs.org/docs/forwarding-refs.html
// We do this to pass refs properly rather than just prop threading
const FormField = forwardRef(
  // NOTE: This is a thin wrapper over FormInput for compatibility with existing components.
  // We use a ...rest argument to make clear and prop spread as all arguments
  // should be forwarded to the underlying FormInput (except compatibility props)
  ({ disabled = false, ...rest }, ref) => (
    <div className="d-flex text-nowrap">
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <FormInput alwaysDisabled={disabled} ref={ref} {...rest} />
    </div>
  )
)

export default FormField

FormField.propTypes = {
  disabled: PropTypes.bool,
}
