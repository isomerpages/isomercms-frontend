import {
  CollaboratorsStats,
  SiteDashboardInfo,
  SiteDashboardReviewRequest,
} from "types/siteDashboard"
import { SiteLaunchDto } from "types/siteLaunch"

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
    .get<{ reviews: SiteDashboardReviewRequest[] }>(endpoint)
    .then(({ data }) => data.reviews)
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

export const getSiteLaunchStatus = async (
  siteName: string
): Promise<SiteLaunchDto> => {
  const endpoint = `/sites/${siteName}/launchInfo`
  return apiService.get(endpoint).then((res) => res.data)
}
