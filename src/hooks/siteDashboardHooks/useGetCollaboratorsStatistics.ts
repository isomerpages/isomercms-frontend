import { useQuery } from "react-query"
import type { UseQueryResult } from "react-query"

import { SITE_DASHBOARD_COLLABORATORS_KEY } from "constants/queryKeys"

import * as SiteDashboardService from "services/SiteDashboardService"

import { CollaboratorsStats } from "types/siteDashboard"

export const useGetCollaboratorsStatistics = (
  siteName: string
): UseQueryResult<CollaboratorsStats> => {
  return useQuery<CollaboratorsStats>(
    [SITE_DASHBOARD_COLLABORATORS_KEY, siteName],
    () => SiteDashboardService.getCollaboratorsStatistics(siteName),
    {
      retry: false,
    }
  )
}
