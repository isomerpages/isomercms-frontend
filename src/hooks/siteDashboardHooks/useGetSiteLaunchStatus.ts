import { UseQueryResult, useQuery } from "react-query"

import { SITE_DASHBOARD_LAUNCH_STATUS_KEY } from "constants/queryKeys"

import * as SiteLaunchService from "services/SiteLaunchService"

import { SiteLaunchDto } from "types/siteLaunch"

const FIVE_MINUTES = 1000 * 60 * 5

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
      // we want to refetch the data every 5 minutes
      // during the site launch process. Else, it will
      // only be updated on a hard refresh.
      refetchInterval: FIVE_MINUTES,
      refetchIntervalInBackground: true,
    }
  )
}
