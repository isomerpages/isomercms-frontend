import { useQuery, UseQueryResult } from "react-query"

import { SITE_URL_KEY } from "constants/queryKeys"

import * as SiteDashboardService from "services/SiteDashboardService"

const getSiteUrl = async (siteName: string): Promise<string> => {
  return SiteDashboardService.getUserProvidedSiteUrl(siteName)
    .then((url) => {
      if (url) return `https://${url}`

      return SiteDashboardService.getSiteUrl(siteName)
    })
    .then((url) => {
      if (url.endsWith("/")) return url.slice(0, -1)

      return url
    })
}

export const useGetSiteUrl = (siteName: string): UseQueryResult<string> => {
  return useQuery<string>(
    [SITE_URL_KEY, siteName],
    () => getSiteUrl(siteName),
    {
      retry: false,
      initialData: "",
    }
  )
}
