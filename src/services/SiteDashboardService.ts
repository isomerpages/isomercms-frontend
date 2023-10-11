import {
  CollaboratorsStats,
  LastUpdatedInfo,
  SiteDashboardInfo,
  SiteDashboardReviewRequest,
} from "types/siteDashboard"

import { apiService } from "./ApiService"

export const getLastUpdated = async (
  siteName: string
): Promise<LastUpdatedInfo> => {
  const endpoint = `/sites/${siteName}/lastUpdated`
  return apiService.get<LastUpdatedInfo>(endpoint).then((res) => res.data)
}

export const getSiteInfo = async (
  siteName: string
): Promise<SiteDashboardInfo> => {
  const endpoint = `/sites/${siteName}/info`
  return apiService.get<SiteDashboardInfo>(endpoint).then((res) => res.data)
}

export const getReviewRequests = async (
  siteName: string
): Promise<SiteDashboardReviewRequest[] | null> => {
  const endpoint = `/sites/${siteName}/review/summary`
  return apiService
    .get<{ reviews: SiteDashboardReviewRequest[] } | { message: string }>(
      endpoint
    )
    .then(({ data }) => {
      if ("reviews" in data) {
        return data.reviews
      }
      // Site is not migrated
      return null
    })
}

export const getCollaboratorsStatistics = async (
  siteName: string
): Promise<CollaboratorsStats> => {
  const endpoint = `/sites/${siteName}/collaborators/statistics`
  return apiService.get<CollaboratorsStats>(endpoint).then((res) => res.data)
}

export const updateViewedReviewRequests = async (
  siteName: string
): Promise<void> => {
  const endpoint = `/sites/${siteName}/review/viewed`
  return apiService.post(endpoint)
}
