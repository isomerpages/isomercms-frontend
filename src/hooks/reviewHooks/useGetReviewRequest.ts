import { AxiosError } from "axios"
import { useQuery } from "react-query"
import type { UseQueryResult } from "react-query"

import { REVIEW_REQUEST_QUERY_KEY } from "constants/queryKeys"

import * as ReviewService from "services/ReviewService"

import { ErrorDto } from "types/error"
import { ReviewRequest } from "types/reviewRequest"

export const useGetReviewRequest = (
  siteName: string,
  reviewId: number
): UseQueryResult<ReviewRequest, AxiosError<ErrorDto>> => {
  return useQuery<ReviewRequest, AxiosError<ErrorDto>>(
    [REVIEW_REQUEST_QUERY_KEY, siteName, reviewId],
    () => ReviewService.getReviewRequest(siteName, reviewId),
    {
      retry: false,
    }
  )
}
