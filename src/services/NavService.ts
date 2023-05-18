import { NavDto } from "types/nav"

import { apiService } from "./ApiService"

const getNavEndpoint = (siteName: string): string => {
  return `/sites/${siteName}/navigation`
}

export const getNav = async (siteName: string): Promise<NavDto> => {
  const endpoint = getNavEndpoint(siteName)
  return apiService.get(endpoint).then((res) => res.data)
}

export const updateNav = async (
  siteName: string,
  navData: NavDto
): Promise<void> => {
  const endpoint = getNavEndpoint(siteName)
  return apiService.post(endpoint, navData).then((res) => res.data)
}
