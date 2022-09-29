export enum ReviewRequestStatus {
  PENDING = "PENDING",
  APPROVED = "APPROVED",
}

export type CollaboratorsStats = {
  total: number
  inactive: number
}

export type SiteDashboardReviewRequest = {
  id: number
  title: string
  description: string
  author: string
  status: ReviewRequestStatus
  changedFiles: number
  newComments: number
  firstView: boolean
  createdAt: number // Unix timestamp
}

export type SiteDashboardInfo = {
  savedAt: number // Unix timestamp
  savedBy: any // TODO: To change to user
  publishedAt: number // Unix timestamp
  publishedBy: any // TODO: To change to user
  stagingUrl: string
  siteUrl: string
}
