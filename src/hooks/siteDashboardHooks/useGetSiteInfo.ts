import { useQuery } from "react-query"
import type { UseQueryResult } from "react-query"

import { SITE_DASHBOARD_INFO_KEY } from "constants/queryKeys"

import * as SiteDashboardService from "services/SiteDashboardService"

import type { SiteDashboardInfo } from "types/sitedashboard"

export const useGetSiteInfo = (
  siteName: string
): UseQueryResult<SiteDashboardInfo> => {
  return useQuery<SiteDashboardInfo>(
    [SITE_DASHBOARD_INFO_KEY, siteName],
    () => SiteDashboardService.getSiteInfo(siteName),
    {
      retry: false,
    }
  )
}
