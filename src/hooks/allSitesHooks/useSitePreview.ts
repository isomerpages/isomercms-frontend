import { useQuery, UseQueryResult } from "react-query"

import { SITE_PREVIEW_KEY } from "constants/queryKeys"

import * as AllSitesService from "services/AllSitesService"

import { SitePreviewRequest } from "types/sites"

export const useSitePreview = (
  userEmail: string,
  sites: string[]
): UseQueryResult<SitePreviewRequest[]> => {
  return useQuery<SitePreviewRequest[]>(
    [SITE_PREVIEW_KEY, userEmail],
    () => AllSitesService.getSitePreview(sites),
    {
      retry: false,
      refetchOnWindowFocus: false,
      onError: (error) => {
        console.log(error)
      },
    }
  )
}
