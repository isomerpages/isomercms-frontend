import { FormControl } from "@chakra-ui/react"
import {
  Button,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@opengovsg/design-system-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

import { ContactOtpProps } from "types/contact"

interface ContactFormProps {
  contactNumber: string
  onSubmit: (inputs: ContactOtpProps) => Promise<void>
  errorMessage: string
}

export const ContactOtpForm = ({
  contactNumber,
  onSubmit,
  errorMessage,
}: ContactFormProps) => {
  const {
    handleSubmit,
    register,
    formState,
    setError,
  } = useForm<ContactOtpProps>({
    mode: "onBlur",
  })

  useEffect(() => {
    if (errorMessage)
      setError("otp", {
        type: "server",
        message: errorMessage,
      })
  }, [errorMessage, setError])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl
        isInvalid={!!formState.errors.otp}
        isReadOnly={formState.isSubmitting}
      >
        <FormLabel isRequired htmlFor="otp">
          {`Enter OTP sent to ${contactNumber}`}
        </FormLabel>
        <Input
          autoFocus
          id="otp"
          {...register("otp", {
            pattern: {
              value: /^[0-9\b]+$/, // \b is a word boundary - link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Assertions
              message: "Only numbers are allowed.",
            },
            maxLength: { value: 6, message: "Please enter a 6 digit OTP." },
            minLength: { value: 6, message: "Please enter a 6 digit OTP." },
          })}
        />
        <FormErrorMessage>{formState.errors.otp?.message}</FormErrorMessage>
        <Button mt="1rem" type="submit" isLoading={formState.isSubmitting}>
          Verify
        </Button>
      </FormControl>
    </form>
  )
}
