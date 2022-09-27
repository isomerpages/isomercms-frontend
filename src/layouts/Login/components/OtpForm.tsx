import { HStack, FormControl } from "@chakra-ui/react"
import {
  Button,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@opengovsg/design-system-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

import { useTimer } from "hooks/useTimer"

export type OtpProps = {
  otp: string
}

interface OtpFormProps {
  email: string
  onSubmit: (inputs: OtpProps) => Promise<void>
  onResendOtp: () => Promise<void>
  errorMessage: string
}

const OTP_TIMER_INTERVAL = 60

const validateOtp = (value: string) =>
  value.length === 6 || "Please enter a 6 digit OTP."

const getOtpResendMessage = (remainingTime: number): string => {
  if (remainingTime === 0) {
    return "Resend OTP"
  }

  return `Resend OTP in ${remainingTime}s`
}

export const OtpForm = ({
  email,
  onSubmit,
  onResendOtp,
  errorMessage,
}: OtpFormProps): JSX.Element => {
  const { timer, setTimer } = useTimer(OTP_TIMER_INTERVAL)
  const { handleSubmit, register, formState, setError } = useForm<OtpProps>({
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
          {`Enter OTP sent to ${email}`}
        </FormLabel>
        <Input
          type="text"
          maxLength={6}
          inputMode="numeric"
          autoComplete="one-time-code"
          {...register("otp", {
            pattern: {
              value: /^[0-9\b]+$/, // \b is a word boundary - link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions/Assertions
              message: "Only numbers are allowed.",
            },
            validate: validateOtp,
          })}
        />
        <FormErrorMessage>{formState.errors.otp?.message}</FormErrorMessage>
        <HStack mt="1rem" alignItems="center" spacing="2.5rem">
          <Button type="submit" isLoading={formState.isSubmitting}>
            Log in
          </Button>
          <Button
            variant="link"
            isDisabled={timer > 0}
            onClick={() => {
              setTimer(OTP_TIMER_INTERVAL)
              onResendOtp()
            }}
          >
            {getOtpResendMessage(timer)}
          </Button>
        </HStack>
      </FormControl>
    </form>
  )
}
