import { useQuery, UseQueryResult } from "react-query"

import { SITE_URL_KEY } from "constants/queryKeys"

import { apiService } from "services/ApiService"

const getSiteUrl = async (siteName: string) => {
  const settingsResp = await apiService.get(
    `${process.env.REACT_APP_BACKEND_URL_V2}/sites/${siteName}/settings`
  )
  return settingsResp.data.url
}

export const useGetSiteUrl = (siteName: string): UseQueryResult<string> => {
  return useQuery<string>(
    [SITE_URL_KEY, siteName],
    () => getSiteUrl(siteName),
    {
      retry: false,
    }
  )
}
