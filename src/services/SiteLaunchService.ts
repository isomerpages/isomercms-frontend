import { SiteLaunchDto } from "types/siteLaunch"

import { apiService } from "./ApiService"

export const launchSite = async (
  siteName: string,
  siteUrl: string,
  useWwwSubdomain: boolean
): Promise<void> => {
  const endpoint = `/sites/${siteName}/launchSite`
  return apiService.post(endpoint, { siteUrl, useWwwSubdomain })
}

export const getSiteLaunchStatus = async (
  siteName: string
): Promise<SiteLaunchDto> => {
  const endpoint = `/sites/${siteName}/launchInfo`
  return apiService.get(endpoint).then((res) => res.data)
}
