import _ from "lodash"
import { useQuery, UseQueryResult } from "react-query"
import type { StringKeyOf } from "type-fest"

import { settingsService } from "services/SettingsService"

import {
  BackendSiteSettings,
  SiteColourSettings,
  SiteSettings,
  SiteSocialMediaSettings,
} from "types/settings"

import { SETTINGS_CONTENT_KEY } from "../queryKeys"

import { BE_TO_FE } from "./constants"

const DEFAULT_BE_STATE = {
  title: "",
  description: "",
  favicon: "",
  shareicon: "",
  facebook_pixel: "",
  google_analytics: "",
  linkedin_insights: "",
  is_government: "",
  contact_us: "",
  feedback: "",
  faq: "",
  show_reach: "",
  logo: "",
}

const DEFAULT_SOCIAL_MEDIA_SETTINGS: SiteSocialMediaSettings = {
  facebook: "",
  linkedin: "",
  twitter: "",
  youtube: "",
  instagram: "",
  telegram: "",
  tiktok: "",
}

const TOGGLED_VALUES = ["is_government", "show_reach"]

const convertfromBe = (backendSettings: BackendSiteSettings): SiteSettings => {
  const toggledValues: Pick<
    SiteSettings,
    "displayGovMasthead" | "showReach"
  > = _(backendSettings)
    .pick(TOGGLED_VALUES)
    .mapValues((value) => {
      // For toggle fields, the backend can omit, return as bool or return the value as a string
      // Hence, a check + conversion is necessary
      if (!value || value === "false") return false
      return true
    })
    .mapKeys((_value, key) => {
      // NOTE: cast is required as lodash does not infer the specific types
      return BE_TO_FE[key as "is_government" | "show_reach"]
    })
    // NOTE: Need to cast as no generic argument and lodash infers typing automatically.
    // The inferred type is more general than ours, so a cast is required
    .value() as Pick<SiteSettings, "displayGovMasthead" | "showReach">

  const socialMediaContent: SiteSocialMediaSettings = {
    ...DEFAULT_SOCIAL_MEDIA_SETTINGS,
    // Only spread concrete values - undefined will use ""
    ..._.pickBy(backendSettings.social_media),
  }

  const colours: SiteColourSettings = {
    primaryColour: backendSettings.colors["primary-color"],
    secondaryColour: backendSettings.colors["secondary-color"],
    mediaColours: backendSettings.colors["media-colors"].map(
      ({ color }) => color
    ),
  }

  const rest = _(backendSettings)
    .omit([
      ...TOGGLED_VALUES,
      "socialMediaContent",
      "colors",
      // This property is extra and will lead to errors in validation
      "resources_name",
    ])
    .pickBy()
    .value()

  const remainingWithDefault: Omit<
    SiteSettings,
    "socialMediaContent" | "colours" | "showReach" | "displayGovMasthead"
  > = _({
    ...DEFAULT_BE_STATE,
    ...rest,
  })
    .mapKeys((_value, key) => BE_TO_FE[key as StringKeyOf<BackendSiteSettings>])
    .value() as Omit<
    SiteSettings,
    "socialMediaContent" | "colours" | "showReach" | "displayGovMasthead"
  >

  return {
    ...remainingWithDefault,
    ...toggledValues,
    socialMediaContent,
    colours,
  }
}

export const useGetSettings = (
  siteName: string
): UseQueryResult<SiteSettings> => {
  return useQuery<SiteSettings>(
    [SETTINGS_CONTENT_KEY, siteName],
    () => settingsService.get({ siteName }).then(convertfromBe),
    {
      retry: false,
    }
  )
}
