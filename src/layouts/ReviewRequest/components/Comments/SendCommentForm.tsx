import { FormControl, HStack } from "@chakra-ui/react"
import {
  FormErrorMessage,
  IconButton,
  Input,
} from "@opengovsg/design-system-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { BiSend } from "react-icons/bi"

import { useUpdateComments } from "hooks/commentsHooks"

import { getAxiosErrorMessage } from "utils/axios"

import { CommentProps } from "types/comments"

export interface CommentFormProps {
  comment: string
}

export const SendCommentForm = ({
  siteName,
  requestId,
}: CommentProps): JSX.Element => {
  const {
    handleSubmit,
    register,
    formState,
    setError,
  } = useForm<CommentFormProps>({
    mode: "onBlur",
  })

  const {
    mutateAsync: updateNotifications,
    error: updateNotificationsError,
  } = useUpdateComments()

  const handleUpdateNotifications = async ({ comment }: CommentFormProps) => {
    await updateNotifications({ siteName, requestId, message: comment })
  }

  useEffect(() => {
    if (updateNotificationsError)
      setError("comment", {
        type: "server",
        message: getAxiosErrorMessage(updateNotificationsError),
      })
  }, [setError, updateNotificationsError])

  return (
    <form onSubmit={handleSubmit(handleUpdateNotifications)}>
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
