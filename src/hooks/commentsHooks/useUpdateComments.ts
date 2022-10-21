import { AxiosError } from "axios"
import { useMutation, UseMutationResult } from "react-query"

import * as CommentsService from "services/CommentsService"

import { UpdateCommentProps } from "types/comments"

export const useUpdateComments = (): UseMutationResult<
  void,
  AxiosError<{ message: string }>,
  UpdateCommentProps
> => {
  return useMutation<void, AxiosError<{ message: string }>, UpdateCommentProps>(
    ({ siteName, requestId, message }) =>
      CommentsService.updateComments({ siteName, requestId, message })
  )
}
