import _ from "lodash"

import { BackendSiteSettings } from "types/settings"

import { apiService } from "./ApiService"

const getSettingsEndpoint = (siteName: string): string => {
  return `/sites/${siteName}/settings`
}

const get = async ({
  siteName,
}: {
  siteName: string
}): Promise<BackendSiteSettings> => {
  const endpoint = getSettingsEndpoint(siteName)
  return apiService.get<BackendSiteSettings>(endpoint).then((res) => res.data)
}

// wrap in object with 1 prop of configsettings (?)
const update = async (
  siteName: string,
  // eslint-disable-next-line camelcase
  { facebook_pixel, linkedin_insights, ...rest }: BackendSiteSettings
): Promise<void> => {
  const endpoint = getSettingsEndpoint(siteName)
  // Isomer templates for these keys utilize kebab case and they need to be changed accordingly
  const renamedSettings = {
    ...rest,
    "facebook-pixel": facebook_pixel,
    "linkedin-insights": linkedin_insights,
  }

  return apiService.post(endpoint, renamedSettings)
}

export const settingsService = {
  get,
  update,
}
