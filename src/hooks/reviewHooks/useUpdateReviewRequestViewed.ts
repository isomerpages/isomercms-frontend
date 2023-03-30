import type { AxiosError } from "axios"
import { useMutation } from "react-query"
import type { UseMutationResult } from "react-query"

import * as ReviewService from "services/ReviewService"

export const useUpdateReviewRequestViewed = (): UseMutationResult<
  void,
  AxiosError<{ message: string }>,
  { siteName: string; prNumber: number }
> => {
  return useMutation<
    void,
    AxiosError<{ message: string }>,
    { siteName: string; prNumber: number }
  >(({ siteName, prNumber }) =>
    ReviewService.updateReviewRequestViewed(siteName, prNumber)
  )
}
