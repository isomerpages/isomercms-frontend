import { UseQueryResult, useQuery } from "react-query"

import { SITE_DASHBOARD_LAUNCH_STATUS_KEY } from "constants/queryKeys"

import * as SiteLaunchService from "services/SiteLaunchService"

import { SiteLaunchDto } from "types/siteLaunch"

export const useGetSiteLaunchStatus = (
  siteName: string
): UseQueryResult<SiteLaunchDto> => {
  return useQuery<SiteLaunchDto>(
    [SITE_DASHBOARD_LAUNCH_STATUS_KEY, siteName],
    () => {
      return SiteLaunchService.getSiteLaunchStatus(siteName)
    },
    {
      retry: false,
    }
  )
}
