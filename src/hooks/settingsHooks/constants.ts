import { invert } from "lodash"
import type { StringKeyOf } from "type-fest"

import { BackendSiteSettings, SiteSettings } from "types/settings"

export const BE_TO_FE: {
  [K in keyof BackendSiteSettings]: StringKeyOf<SiteSettings>
} = {
  title: "title",
  description: "description",
  shareicon: "shareicon",
  favicon: "favicon",
  facebook_pixel: "pixel",
  google_analytics: "ga",
  linkedin_insights: "insights",
  is_government: "displayGovMasthead",
  colors: "colours",
  contact_us: "contact",
  feedback: "feedback",
  faq: "faq",
  show_reach: "showReach",
  logo: "agencyLogo",
  social_media: "socialMediaContent",
  url: "url",
}

export const FE_TO_BE = invert(BE_TO_FE)
