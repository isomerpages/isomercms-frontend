import { BackendSiteSettings } from "types/settings"

import { apiService } from "./ApiService"

const getSettingsEndpoint = (siteName: string): string => {
  return `/sites/${siteName}/settings`
}

export const get = async ({
  siteName,
}: {
  siteName: string
}): Promise<BackendSiteSettings> => {
  const endpoint = getSettingsEndpoint(siteName)
  return apiService.get<BackendSiteSettings>(endpoint).then((res) => res.data)
}

export const update = async (
  siteName: string,
  // eslint-disable-next-line camelcase
  {
    facebook_pixel: pixel,
    linkedin_insights: insights,
    ...rest
  }: BackendSiteSettings
): Promise<void> => {
  const endpoint = getSettingsEndpoint(siteName)
  // Isomer templates for these keys utilize kebab case and they need to be changed accordingly
  const renamedSettings = {
    ...rest,
    "facebook-pixel": pixel,
    "linkedin-insights": insights,
  }

  return apiService.post(endpoint, renamedSettings)
}
