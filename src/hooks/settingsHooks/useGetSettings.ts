import _, { unionWith, zip } from "lodash"
import { useQuery, UseQueryResult } from "react-query"
import type { StringKeyOf } from "type-fest"

import * as SettingsService from "services/SettingsService"

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
  favicon: "/images/isomer-logo.svg",
  shareicon: "/images/isomer-logo.svg",
  facebook_pixel: "",
  google_analytics: "",
  linkedin_insights: "",
  is_government: false,
  contact_us: "",
  feedback: "",
  faq: "",
  show_reach: false,
  logo: "/images/isomer-logo.svg",
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

const DEFAULT_COLOUR_SETTINGS: SiteColourSettings = {
  primaryColour: "#e72a70",
  secondaryColour: "#38f731",
  mediaColours: ["#e98691", "#f30c0c", "#2b3033", "#2b3033", "#2b3033"],
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
    primaryColour:
      backendSettings.colors["primary-color"] ||
      DEFAULT_COLOUR_SETTINGS.primaryColour,
    secondaryColour:
      backendSettings.colors["secondary-color"] ||
      DEFAULT_COLOUR_SETTINGS.secondaryColour,
    mediaColours: zip(
      backendSettings.colors["media-colors"].map(({ color }) => color),
      DEFAULT_COLOUR_SETTINGS.mediaColours
    ).map(([beValue, defaultValue]) => beValue || defaultValue!),
  }

  const rest = _(backendSettings)
    .omit([
      ...TOGGLED_VALUES,
      "socialMediaContent",
      "colors",
      // These properties are extra and will lead to errors in validation
      "resources_name",
      "url",
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
    () => SettingsService.get({ siteName }).then(convertfromBe),
    {
      retry: false,
    }
  )
}
