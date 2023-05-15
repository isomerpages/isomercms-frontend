import { HomepageDto } from "types/homepage"

import { apiService } from "./ApiService"

const getHomepageEndpoint = (siteName: string): string => {
  return `/sites/${siteName}/homepage`
}

export const getHomepage = async (siteName: string): Promise<HomepageDto> => {
  const endpoint = getHomepageEndpoint(siteName)
  return apiService.get(endpoint).then((res) => res.data)
}

export const updateHomepage = async (
  siteName: string,
  homepageData: HomepageDto
): Promise<void> => {
  const endpoint = getHomepageEndpoint(siteName)
  return apiService.post(endpoint, homepageData).then((res) => res.data)
}
