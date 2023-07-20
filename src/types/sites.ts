export interface SiteData {
  lastUpdated: string
  permissions: string
  repoName: string
  isPrivate: boolean
}

export interface SiteDataRequest {
  siteNames: SiteData[]
}

export interface SitePreviewRequest {
  imageUrl: string
}
