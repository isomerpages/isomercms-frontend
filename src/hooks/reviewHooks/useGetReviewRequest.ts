import { useQuery } from "react-query"
import type { UseQueryResult } from "react-query"

import { REVIEW_REQUEST_QUERY_KEY } from "constants/queryKeys"

import * as ReviewService from "services/ReviewService"

import { ReviewRequest } from "types/reviewRequest"

export const useGetReviewRequest = (
  siteName: string,
  reviewId: number
): UseQueryResult<ReviewRequest> => {
  return useQuery<ReviewRequest>(
    [REVIEW_REQUEST_QUERY_KEY, siteName, reviewId],
    () => ReviewService.getReviewRequest(siteName, reviewId),
    {
      retry: false,
    }
  )
}
