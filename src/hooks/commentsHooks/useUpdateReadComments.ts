import { AxiosError } from "axios"
import { useMutation, UseMutationResult } from "react-query"

import * as CommentsService from "services/CommentsService"

import { CommentProps } from "types/comments"

export const useUpdateReadComments = (): UseMutationResult<
  void,
  AxiosError,
  CommentProps
> => {
  return useMutation<void, AxiosError, CommentProps>(
    ({ siteName, requestId }) =>
      CommentsService.updateReadComments({ siteName, requestId })
  )
}
