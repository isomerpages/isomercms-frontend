import type { AxiosError } from "axios"
import { useMutation } from "react-query"
import type { UseMutationResult } from "react-query"

import * as SiteDashboardService from "services/SiteDashboardService"

export const useUpdateViewedReviewRequests = (): UseMutationResult<
  void,
  AxiosError<{ message: string }>,
  { siteName: string }
> => {
  return useMutation<
    void,
    AxiosError<{ message: string }>,
    { siteName: string }
  >(({ siteName }) => SiteDashboardService.updateViewedReviewRequests(siteName))
}
