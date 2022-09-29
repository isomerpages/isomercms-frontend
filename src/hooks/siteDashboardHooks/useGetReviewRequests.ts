import { useQuery } from "react-query"
import type { UseQueryResult } from "react-query"

import { SITE_DASHBOARD_REVIEW_REQUEST_KEY } from "constants/queryKeys"

import * as SiteDashboardService from "services/SiteDashboardService"

import type { SiteDashboardReviewRequest } from "types/sitedashboard"

export const useGetReviewRequests = (
  siteName: string
): UseQueryResult<SiteDashboardReviewRequest[]> => {
  return useQuery<SiteDashboardReviewRequest[]>(
    [SITE_DASHBOARD_REVIEW_REQUEST_KEY, siteName],
    () => SiteDashboardService.getReviewRequests(siteName),
    {
      retry: false,
    }
  )
}
