import { AxiosError } from "axios"
import { UseMutationResult, useMutation, useQueryClient } from "react-query"

import {
  REVIEW_REQUEST_QUERY_KEY,
  SITE_DASHBOARD_REVIEW_REQUEST_KEY,
} from "constants/queryKeys"

import { ErrorDto } from "types/error"
import { ReviewRequestInfo } from "types/reviewRequest"

import * as ReviewService from "../../services/ReviewService"

export const useCreateReviewRequest = (
  siteName: string
): UseMutationResult<number, AxiosError<ErrorDto>, ReviewRequestInfo> => {
  const queryClient = useQueryClient()
  return useMutation(
    ({ reviewers, ...rest }) =>
      ReviewService.createReviewRequest(siteName, {
        ...rest,
        reviewers: reviewers.map(({ value }) => value),
      }),
    {
      onSettled: () => {
        queryClient.invalidateQueries([REVIEW_REQUEST_QUERY_KEY, siteName])
        queryClient.invalidateQueries([
          SITE_DASHBOARD_REVIEW_REQUEST_KEY,
          siteName,
        ])
      },
    }
  )
}
