import { FormControl } from "@chakra-ui/react"
import {
  Button,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@opengovsg/design-system-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"

export type LoginProps = {
  email: string
}

interface LoginFormProps {
  onSubmit: (inputs: LoginProps) => Promise<void>
  errorMessage: string
}

const validateEmail = (value: string) =>
  value.length > 0 || "Please enter a valid email."

export const LoginForm = ({
  onSubmit,
  errorMessage,
}: LoginFormProps): JSX.Element => {
  const { handleSubmit, register, formState, setError } = useForm<LoginProps>({
    mode: "onBlur",
  })
  useEffect(() => {
    if (errorMessage)
      setError("email", {
        type: "server",
        message: errorMessage,
      })
  }, [errorMessage, setError])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl
        isInvalid={!!formState.errors.email}
        isReadOnly={formState.isSubmitting}
      >
        <FormLabel isRequired htmlFor="email">
          Log in with a .gov.sg or other whitelisted email address
        </FormLabel>
        <Input
          autoComplete="email"
          autoFocus
          placeholder="e.g. jane@data.gov.sg"
          id="email"
          type="email"
          {...register("email", {
            validate: validateEmail,
          })}
        />
        {formState.errors.email && (
          <FormErrorMessage>{formState.errors.email.message}</FormErrorMessage>
        )}
        <Button mt="1rem" type="submit" isLoading={formState.isSubmitting}>
          Log in
        </Button>
      </FormControl>
    </form>
  )
}
