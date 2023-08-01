import { useFormControlContext } from "@chakra-ui/react"
import { Button, Input } from "@opengovsg/design-system-react"
import { MouseEventHandler } from "react"

import elementStyles from "styles/isomer-cms/Elements.module.scss"

import { RegisterFunc } from "types/forms"

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
  register = () => ({}),
  id,
  onClick = () => ({}),
  inlineButtonText = "Choose Item",
}: FormMediaInputProps): JSX.Element => {
  const {
    isRequired,
    isInvalid: hasError,
    isDisabled,
  } = useFormControlContext()

  return (
    <div className="d-flex">
      <Input
        type="text"
        placeholder={placeholder}
        value={value}
        id={id}
        autoComplete="off"
        required={isRequired}
        className={hasError ? `${elementStyles.error}` : "border-0"}
        disabled
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...register(id, { required: isRequired })}
      />
      {inlineButtonText && (
        <Button type="button" isDisabled={isDisabled} onClick={onClick}>
          {inlineButtonText}
        </Button>
      )}
    </div>
  )
}
