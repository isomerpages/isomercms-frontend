import { AxiosError } from "axios"
import { UseMutationResult, useMutation, useQueryClient } from "react-query"

import {
  REVIEW_REQUEST_QUERY_KEY,
  SITE_DASHBOARD_REVIEW_REQUEST_KEY,
} from "constants/queryKeys"

import { ErrorDto } from "types/error"

import * as ReviewService from "../../services/ReviewService"

export const useCancelReviewRequest = (
  siteName: string,
  prNumber: number
): UseMutationResult<void, AxiosError<ErrorDto>, void> => {
  const queryClient = useQueryClient()
  return useMutation(
    () => ReviewService.cancelReviewRequest(siteName, prNumber),
    {
      onSettled: () => {
        queryClient.invalidateQueries([
          REVIEW_REQUEST_QUERY_KEY,
          siteName,
          prNumber,
        ])
        // NOTE: Need to invalidate to force a refetch
        // and display status update on review request.
        queryClient.invalidateQueries([
          SITE_DASHBOARD_REVIEW_REQUEST_KEY,
          siteName,
        ])
      },
    }
  )
}
