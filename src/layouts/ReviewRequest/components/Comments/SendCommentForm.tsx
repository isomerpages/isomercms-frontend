import { FormControl, HStack } from "@chakra-ui/react"
import {
  Button,
  FormErrorMessage,
  IconButton,
  Input,
} from "@opengovsg/design-system-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { BiSend } from "react-icons/bi"

export interface CommentFormProps {
  comment: string
}

interface SendContactFormProps {
  onSubmit: (inputs: CommentFormProps) => Promise<void>
  errorMessage: string
}

export const SendCommentForm = ({
  onSubmit,
  errorMessage,
}: SendContactFormProps) => {
  const {
    handleSubmit,
    register,
    formState,
    setError,
  } = useForm<CommentFormProps>({
    mode: "onBlur",
  })

  useEffect(() => {
    if (errorMessage)
      setError("comment", {
        type: "server",
        message: errorMessage,
      })
  }, [errorMessage, setError])

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <FormControl
        isInvalid={!!formState.errors.comment}
        isReadOnly={formState.isSubmitting}
      >
        <HStack pb="1.5rem">
          <Input
            placeholder="Leave a comment"
            autoFocus
            id="comment"
            {...register("comment")}
          />
          <IconButton
            icon={<BiSend />}
            variant="clear"
            aria-label="link to send comment"
            type="submit"
            isLoading={formState.isSubmitting}
          />
        </HStack>
        <FormErrorMessage>{formState.errors.comment?.message}</FormErrorMessage>
      </FormControl>
    </form>
  )
}
