import { AxiosError } from "axios"
import { useMutation, UseMutationResult } from "react-query"

import * as CommentsService from "services/CommentsService"

import { UpdateCommentProps } from "types/comments"

export const useUpdateComments = (): UseMutationResult<
  void,
  AxiosError,
  UpdateCommentProps
> => {
  return useMutation<void, AxiosError, UpdateCommentProps>(
    ({ siteName, requestId, message }) =>
      CommentsService.updateComments({ siteName, requestId, message })
  )
}
