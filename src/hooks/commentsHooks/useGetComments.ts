import { AxiosError } from "axios"
import { useQuery } from "react-query"
import type { UseQueryResult } from "react-query"

import { COMMENTS_KEY } from "constants/queryKeys"

import * as CommentsService from "services/CommentsService"

import { CommentData, CommentProps } from "types/comments"

export const useGetComments = ({
  siteName,
  requestId,
}: CommentProps): UseQueryResult<
  CommentData[],
  AxiosError<{ message: string }>
> => {
  return useQuery<CommentData[], AxiosError<{ message: string }>>(
    [COMMENTS_KEY, siteName],
    () => CommentsService.getComments({ siteName, requestId }),
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  )
}
