import { useQuery, UseQueryResult } from "react-query"

import { SITE_URL_KEY } from "constants/queryKeys"

import { getSiteUrl } from "services/ReviewService"

export const useGetSiteUrl = (siteName: string): UseQueryResult<string> => {
  return useQuery<string>(
    [SITE_URL_KEY, siteName],
    () => getSiteUrl(siteName),
    {
      retry: false,
    }
  )
}
