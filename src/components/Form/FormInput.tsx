import type { InputProps } from "@chakra-ui/react"
import { Input } from "@opengovsg/design-system-react"
import type { ChangeEventHandler, ForwardedRef, LegacyRef } from "react"
import { forwardRef } from "react"

import { useFormContext } from "./FormContext"

export type FormInputProps = InputProps & {
  value: string
  id: string
  placeholder?: string
  alwaysDisabled?: boolean
  onChange?: ChangeEventHandler<HTMLInputElement>
  onBlur?: ChangeEventHandler<HTMLInputElement>
  name?: string
}

// NOTE: Read about forwardRef here: https://reactjs.org/docs/forwarding-refs.html
// We do this to pass refs properly rather than just prop threading
const FormInput = forwardRef<InputProps, FormInputProps>(
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
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onChange = () => {},
      // eslint-disable-next-line @typescript-eslint/no-empty-function
      onBlur = () => {},
      name = "",
    }: FormInputProps,
    ref: ForwardedRef<InputProps>
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
        ref={ref as LegacyRef<HTMLInputElement>}
      />
    )
  }
)

export default FormInput
