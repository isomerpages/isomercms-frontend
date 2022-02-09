import { Flex, useFormControlContext } from "@chakra-ui/react"
import { Button, Input } from "@opengovsg/design-system-react"
import { MouseEventHandler } from "react"
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
    <Flex>
      <Input
        placeholder={placeholder}
        value={value}
        id={id}
        autoComplete="off"
        required={isRequired}
        disabled
        {...register(id, { required: isRequired })}
      />
      {inlineButtonText && (
        <Button onClick={onClick} disabled={isDisabled}>
          {inlineButtonText}
        </Button>
      )}
    </Flex>
  )
}

export default FormMediaInput
