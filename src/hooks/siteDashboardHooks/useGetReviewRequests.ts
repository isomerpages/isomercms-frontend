import { AxiosError } from "axios"
import { useQuery } from "react-query"
import type { UseQueryResult } from "react-query"

import { SITE_DASHBOARD_REVIEW_REQUEST_KEY } from "constants/queryKeys"

import * as SiteDashboardService from "services/SiteDashboardService"

import { ErrorDto } from "types/error"
import type { SiteDashboardReviewRequest } from "types/siteDashboard"

export const useGetReviewRequests = (
  siteName: string
): UseQueryResult<
  SiteDashboardReviewRequest[] | null,
  AxiosError<ErrorDto>
> => {
  return useQuery<SiteDashboardReviewRequest[] | null, AxiosError<ErrorDto>>(
    [SITE_DASHBOARD_REVIEW_REQUEST_KEY, siteName],
    () => SiteDashboardService.getReviewRequests(siteName),
    {
      retry: false,
      refetchOnWindowFocus: false,
    }
  )
}
