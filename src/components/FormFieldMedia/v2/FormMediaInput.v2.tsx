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
  register = () => ({}),
  id,
  onClick = () => ({}),
  inlineButtonText = "Choose Item",
}: FormMediaInputProps): JSX.Element => {
  const { isRequired, isDisabled } = useFormControlContext()

  return (
    <Flex>
      <Input
        // This is disabled because we want to disallow users from typing here.
        // This is meant as a visual display to users, not an interface
        isDisabled
        placeholder={placeholder}
        value={value}
        id={id}
        autoComplete="off"
        // eslint-disable-next-line react/jsx-props-no-spreading
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
