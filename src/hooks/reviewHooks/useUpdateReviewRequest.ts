import { AxiosError } from "axios"
import { useMutation, UseMutationResult, useQueryClient } from "react-query"
import type { SetOptional } from "type-fest"

import { REVIEW_REQUEST_QUERY_KEY } from "constants/queryKeys"

import { updateReviewRequest } from "services/ReviewService"

import { MiddlewareErrorDto, ErrorDto } from "types/error"
import { ReviewRequestInfo } from "types/reviewRequest"

export const useUpdateReviewRequest = (
  siteName: string,
  prNumber: number
): UseMutationResult<
  void,
  AxiosError<ErrorDto | MiddlewareErrorDto>,
  SetOptional<ReviewRequestInfo, "title">
> => {
  const queryClient = useQueryClient()
  return useMutation(
    ({ reviewers }) =>
      updateReviewRequest(siteName, prNumber, {
        reviewers: reviewers.map(({ value }) => value),
      }),
    {
      onSettled: () => {
        queryClient.invalidateQueries([
          REVIEW_REQUEST_QUERY_KEY,
          siteName,
          prNumber,
        ])
      },
    }
  )
}
