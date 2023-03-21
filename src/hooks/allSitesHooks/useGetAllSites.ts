import { useQuery } from "react-query"
import type { UseQueryResult } from "react-query"

import { ALL_SITES_KEY } from "constants/queryKeys"

import * as AllSitesService from "services/AllSitesService"

import { SiteDataRequest } from "types/sites"

export const useGetAllSites = (
  userEmail: string
): UseQueryResult<SiteDataRequest> => {
  return useQuery<SiteDataRequest>(
    [ALL_SITES_KEY, userEmail],
    () => AllSitesService.getAllSites(),
    {
      retry: false,
    }
  )
}
