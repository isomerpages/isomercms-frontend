import { useFormControlContext } from "@chakra-ui/react"
import { MouseEventHandler } from "react"
import { RegisterFunc } from "types/forms"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

export interface FormMediaInputProps {
  value: string
  id: string
  placeholder?: string
  // NOTE: The second type is allowed because we want to default it to that type
  // when consumers don't pass in a register prop
  register?: RegisterFunc | (() => void)
  onClick?: MouseEventHandler<HTMLButtonElement>
  inlineButtonText?: string
}

export const FormMediaInput = ({
  placeholder = "",
  value,
  register = () => {},
  id,
  onClick = () => {},
  inlineButtonText = "Choose Item",
}: FormMediaInputProps): JSX.Element => {
  const {
    isRequired,
    isInvalid: hasError,
    isDisabled,
  } = useFormControlContext()

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

export default FormMediaInput
