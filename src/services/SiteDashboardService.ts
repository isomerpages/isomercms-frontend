import {
  CollaboratorsStats,
  SiteDashboardInfo,
  SiteDashboardReviewRequest,
} from "types/siteDashboard"

import { apiService } from "./ApiService"

export const getSiteInfo = async (
  siteName: string
): Promise<SiteDashboardInfo> => {
  const endpoint = `/sites/${siteName}/info`
  return apiService.get<SiteDashboardInfo>(endpoint).then((res) => res.data)
}

export const getReviewRequests = async (
  siteName: string
): Promise<SiteDashboardReviewRequest[]> => {
  const endpoint = `/sites/${siteName}/review/summary`
  return apiService
    .get<SiteDashboardReviewRequest[]>(endpoint)
    .then((res) => res.data)
}

// TODO: To update when collaborators PR is merged
export const getCollaboratorsStatistics = async (
  siteName: string
): Promise<CollaboratorsStats> => {
  const endpoint = `/sites/${siteName}/collaborators/statistics`
  return apiService.get<CollaboratorsStats>(endpoint).then((res) => res.data)
}
