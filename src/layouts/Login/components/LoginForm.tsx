import { FormControl } from "@chakra-ui/react"
import {
  Button,
  FormLabel,
  Input,
  FormErrorMessage,
} from "@opengovsg/design-system-react"
import { useForm } from "react-hook-form"

export type LoginProps = {
  email: string
}

interface LoginFormProps {
  onSubmit: (inputs: LoginProps) => Promise<void>
}

const validateEmail = (value: string) =>
  value.length > 0 || "Please enter a valid email."

export const LoginForm = ({ onSubmit }: LoginFormProps): JSX.Element => {
  const { handleSubmit, register, formState, setError } = useForm<LoginProps>({
    mode: "onBlur",
  })

  const onSubmitForm = async (inputs: LoginProps) => {
    return onSubmit(inputs).catch((err) => {
      const {
        error: { message },
      } = err.response.data
      setError("email", { type: "server", message })
    })
  }

  return (
    <form onSubmit={handleSubmit(onSubmitForm)}>
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
