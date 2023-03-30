import { FormControl } from "@chakra-ui/react"
import {
  Button,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@opengovsg/design-system-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

import { useLoginContext } from "contexts/LoginContext"

export interface ContactProps {
  mobile: string
}

interface ContactFormProps {
  onSubmit: (inputs: ContactProps) => Promise<void>
  errorMessage: string
}

export const ContactSettingsForm = ({
  onSubmit,
  errorMessage,
}: ContactFormProps) => {
  const {
    handleSubmit,
    register,
    formState,
    setValue,
    setError,
  } = useForm<ContactProps>({
    mode: "onBlur",
  })
  const { contactNumber } = useLoginContext()
  useEffect(() => {
    setValue("mobile", contactNumber)
  }, [contactNumber, setValue])

  useEffect(() => {
    if (errorMessage)
      setError("mobile", {
        type: "server",
        message: errorMessage,
      })
  }, [errorMessage, setError])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl
        isInvalid={!!formState.errors.mobile}
        isReadOnly={formState.isSubmitting}
      >
        <FormLabel isRequired htmlFor="mobile">
          Contact Number
        </FormLabel>
        <Input
          autoFocus
          id="mobile"
          {...register("mobile", {
            pattern: {
              value: /^(6|8|9)[0-9]{7}$/,
              message: "Please enter a valid phone number.",
            },
          })}
        />
        <FormErrorMessage>{formState.errors.mobile?.message}</FormErrorMessage>
        <Button mt="1rem" type="submit" isLoading={formState.isSubmitting}>
          Verify
        </Button>
      </FormControl>
    </form>
  )
}
