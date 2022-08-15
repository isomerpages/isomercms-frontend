import { HStack, FormControl } from "@chakra-ui/react"
import {
  Button,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@opengovsg/design-system-react"
import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"

export type OtpProps = {
  otp: string
}

interface OtpFormProps {
  email: string
  onSubmit: (inputs: OtpProps) => Promise<void>
  onResendOtp: () => Promise<void>
}

const OTP_TIMER_INTERVAL = 60

const validateOtp = (value: string) =>
  value.length === 6 || "Please enter a 6 digit OTP."

export const OtpForm = ({
  email,
  onSubmit,
  onResendOtp,
}: OtpFormProps): JSX.Element => {
  const [timer, setTimer] = useState(OTP_TIMER_INTERVAL)
  const { handleSubmit, register, formState, setError } = useForm<OtpProps>({
    mode: "onBlur",
  })

  const onSubmitForm = async (inputs: OtpProps) => {
    return onSubmit(inputs).catch((err) => {
      const {
        error: { message },
      } = err.response.data
      setError("otp", {
        type: "server",
        message,
      })
    })
  }

  useEffect(() => {
    const interval = setInterval(() => {
      if (timer > 0) setTimer(timer - 1)
    }, 1000)
    return () => clearInterval(interval)
  }, [timer])

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
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
              value: /^[0-9\b]+$/,
              message: "Only numbers are allowed.",
            },
            validate: validateOtp,
          })}
        />
        {formState.errors.otp && (
          <FormErrorMessage>{formState.errors.otp.message}</FormErrorMessage>
        )}
        <HStack mt="1rem" alignItems="center" gap="2.5rem">
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
            {`Resend OTP${
              timer > 0 ? ` in ${timer} second${timer === 1 ? "" : "s"}` : ""
            }`}
          </Button>
        </HStack>
      </FormControl>
    </form>
  )
}
