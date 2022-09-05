import type { InputProps } from "@chakra-ui/react"
import type { ForwardedRef } from "react"
import { forwardRef } from "react"

import type { FormInputProps } from "./Form/FormInput"
import FormInput from "./Form/FormInput"

export type FormFieldProps = FormInputProps & {
  disabled?: boolean
}

// NOTE: Read about forwardRef here: https://reactjs.org/docs/forwarding-refs.html
// We do this to pass refs properly rather than just prop threading
const FormField = forwardRef<InputProps, FormFieldProps>(
  // NOTE: This is a thin wrapper over FormInput for compatibility with existing components.
  // We use a ...rest argument to make clear and prop spread as all arguments
  // should be forwarded to the underlying FormInput (except compatibility props)
  (
    { disabled = false, ...rest }: FormFieldProps,
    ref: ForwardedRef<InputProps>
  ) => (
    <div className="d-flex text-nowrap">
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <FormInput alwaysDisabled={disabled} ref={ref} {...rest} />
    </div>
  )
)

export default FormField
