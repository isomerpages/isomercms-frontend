import { useQuery, UseQueryResult } from "react-query"

import { STAGING_URL_KEY } from "constants/queryKeys"

import { getStagingUrl } from "services/SiteDashboardService"

export const useGetStagingUrl = (siteName: string): UseQueryResult<string> => {
  return useQuery<string>(
    [STAGING_URL_KEY, siteName],
    () => getStagingUrl(siteName),
    {
      retry: false,
    }
  )
}
