export interface SiteInfo {
  title: string
  description: string
  displayGovMasthead: boolean
  shareicon: string
}

export interface SiteLogoSettings {
  agencyLogo: string
  // cannot be an empty string but entire prop can be missing
  favicon: string
}

export interface SiteColourSettings {
  primaryColour: string
  secondaryColour: string
  // NOTE: This is a fixed length array
  mediaColours: string[]
}

export interface SiteSocialMediaSettings {
  facebook: string
  twitter: string
  youtube: string
  instagram: string
  linkedin: string
  telegram: string
  tiktok: string
}

export interface SiteFooterSettings {
  contact: string
  feedback: string
  faq: string
  showReach: boolean
}

export interface SiteAnalyticsSettings {
  pixel: string
  ga: string
  insights: string
}

export type SiteSettings = SiteInfo &
  SiteLogoSettings & { colours: SiteColourSettings } & {
    socialMediaContent: SiteSocialMediaSettings
  } & SiteFooterSettings &
  SiteAnalyticsSettings

export interface BackendSiteSettings {
  title?: string
  description?: string
  // eslint-disable-next-line camelcase

  shareicon?: string
  // eslint-disable-next-line camelcase
  facebook_pixel?: string
  // eslint-disable-next-line camelcase
  google_analytics?: string
  // eslint-disable-next-line camelcase
  linkedin_insights?: string
  // eslint-disable-next-line camelcase
  is_government?: string | boolean // parse into bool -> can return as "false" | "true"
  colors: BackendSiteColours
  // eslint-disable-next-line camelcase
  contact_us?: string
  feedback?: string
  faq?: string
  // eslint-disable-next-line camelcase
  show_reach?: string | boolean
  logo?: string
  // eslint-disable-next-line camelcase

  favicon?: string
  // eslint-disable-next-line camelcase
  social_media?: BackendSiteSocialMedia
}

interface BackendSiteColours {
  // for pri/sec colours, we can fill in w/ the hook
  "primary-color": string
  "secondary-color": string
  "media-colors": {
    title: string
    color: string
  }[]
}

type BackendSiteSocialMedia = Partial<{
  facebook: string
  linkedin: string
  twitter: string
  youtube: string
  instagram: string
  telegram: string
  tiktok: string
}>
