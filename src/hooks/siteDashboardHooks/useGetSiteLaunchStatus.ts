import { UseQueryResult, useQuery } from "react-query"

import { SITE_DASHBOARD_LAUNCH_STATUS_KEY } from "constants/queryKeys"

import * as SiteDashboardService from "services/SiteDashboardService"

import { SiteLaunchDto } from "types/siteLaunch"

export const useGetSiteLaunchStatus = (
  siteName: string
): UseQueryResult<SiteLaunchDto> => {
  return useQuery<SiteLaunchDto>(
    [SITE_DASHBOARD_LAUNCH_STATUS_KEY, siteName],
    () => SiteDashboardService.getSiteLaunchStatus(siteName),
    {
      retry: false,
      refetch: true,
    }
  )
}
