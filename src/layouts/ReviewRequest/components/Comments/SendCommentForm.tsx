import { FormControl, HStack } from "@chakra-ui/react"
import {
  FormErrorMessage,
  IconButton,
  Input,
} from "@opengovsg/design-system-react"
import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { BiSend } from "react-icons/bi"
import { useQueryClient } from "react-query"

import { COMMENTS_KEY } from "constants/queryKeys"

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
    clearErrors,
    resetField,
  } = useForm<CommentFormProps>({
    mode: "onBlur",
  })

  const {
    mutateAsync: updateNotifications,
    error: updateNotificationsError,
  } = useUpdateComments()

  const queryClient = useQueryClient()

  const handleUpdateNotifications = async ({ comment }: CommentFormProps) => {
    await updateNotifications({ siteName, requestId, message: comment })
    resetField("comment")
    queryClient.invalidateQueries([COMMENTS_KEY, siteName])
  }

  useEffect(() => {
    if (updateNotificationsError)
      setError("comment", {
        type: "server",
        message: getAxiosErrorMessage(updateNotificationsError),
      })
    else clearErrors()
  }, [clearErrors, setError, updateNotificationsError])

  return (
    <form onSubmit={handleSubmit(handleUpdateNotifications)}>
      <FormControl
        isInvalid={!!formState.errors.comment}
        isReadOnly={formState.isSubmitting}
        pb="1.5rem"
      >
        <HStack>
          <Input
            placeholder="Leave a comment"
            autoFocus
            id="comment"
            {...register("comment", {
              minLength: 1,
              required: { value: true, message: "Please enter a comment." },
            })}
          />
          <IconButton
            icon={<BiSend />}
            variant="clear"
            aria-label="link to send comment"
            type="submit"
            isLoading={formState.isSubmitting}
            disabled={!formState.isValid}
          />
        </HStack>
        <FormErrorMessage>{formState.errors.comment?.message}</FormErrorMessage>
      </FormControl>
    </form>
  )
}
