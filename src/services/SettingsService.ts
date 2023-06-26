import { decryptPassword, encryptPassword } from "utils/password"

import {
  BackendPasswordSettings,
  BackendSiteSettings,
  SitePasswordSettings,
} from "types/settings"

import { apiService } from "./ApiService"

const getSettingsEndpoint = (siteName: string): string => {
  return `/sites/${siteName}/settings`
}

const getSettingsPasswordEndpoint = (siteName: string): string => {
  return `/sites/${siteName}/settings/repoPassword`
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

export const getPassword = async ({
  siteName,
}: {
  siteName: string
}): Promise<BackendPasswordSettings> => {
  const endpoint = getSettingsPasswordEndpoint(siteName)
  return apiService
    .get<BackendPasswordSettings>(endpoint)
    .then((res) => res.data)
}

export const updatePassword = async (
  siteName: string,
  // eslint-disable-next-line camelcase
  {
    password,
    encryptedPassword,
    iv,
    isAmplifySite,
    privatiseStaging,
  }: SitePasswordSettings
): Promise<void | null> => {
  const endpoint = getSettingsPasswordEndpoint(siteName)
  // Netlify sites don't have password feature
  if (!isAmplifySite) return null
  const hasPreviousPassword = !!encryptedPassword
  const hasPasswordChanged =
    hasPreviousPassword && decryptPassword(encryptedPassword, iv) !== password

  // No need to call endpoint if password is the same
  const passwordUnchanged =
    privatiseStaging && hasPreviousPassword && !hasPasswordChanged
  const passwordUnset = !privatiseStaging && !hasPreviousPassword
  if (passwordUnchanged || passwordUnset) return null
  if (!password)
    return apiService.post(endpoint, {
      encryptedPassword: "",
      iv: "",
      enablePassword: privatiseStaging,
    })
  const { encryptedPassword: newPassword, iv: newIv } = encryptPassword(
    password
  )
  return apiService.post(endpoint, {
    encryptedPassword: newPassword,
    iv: newIv,
    enablePassword: privatiseStaging,
  })
}
