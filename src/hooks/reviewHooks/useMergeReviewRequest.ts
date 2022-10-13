import { AxiosError } from "axios"
import {
  UseMutationResult,
  useMutation,
  useQueryClient,
  QueryClient,
} from "react-query"

import {
  REVIEW_REQUEST_QUERY_KEY,
  SITE_DASHBOARD_REVIEW_REQUEST_KEY,
} from "constants/queryKeys"

import { ErrorDto } from "types/error"

import * as ReviewService from "../../services/ReviewService"

export const useMergeReviewRequest = (
  siteName: string,
  prNumber: number,
  shouldInvalidate = true
): UseMutationResult<void, AxiosError<ErrorDto>, void> => {
  const queryClient = useQueryClient()
  return useMutation(
    () => ReviewService.mergeReviewRequest(siteName, prNumber),
    {
      onSettled: () => {
        if (shouldInvalidate) {
          invalidateMergeRelatedQueries(queryClient, siteName, prNumber)
        }
      },
    }
  )
}

export const invalidateMergeRelatedQueries = (
  queryClient: QueryClient,
  siteName: string,
  prNumber: number
): void => {
  queryClient.invalidateQueries([REVIEW_REQUEST_QUERY_KEY, siteName, prNumber])
  queryClient.invalidateQueries([SITE_DASHBOARD_REVIEW_REQUEST_KEY, siteName])
}
