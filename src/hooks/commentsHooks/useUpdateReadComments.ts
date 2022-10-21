import { AxiosError } from "axios"
import { useMutation, UseMutationResult } from "react-query"

import * as CommentsService from "services/CommentsService"

import { CommentProps } from "types/comments"

export const useUpdateReadComments = (): UseMutationResult<
  void,
  AxiosError<{ message: string }>,
  CommentProps
> => {
  return useMutation<void, AxiosError<{ message: string }>, CommentProps>(
    ({ siteName, requestId }) =>
      CommentsService.updateReadComments({ siteName, requestId })
  )
}
