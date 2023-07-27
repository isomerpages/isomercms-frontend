import { SiteDataRequest, SitePreviewRequest } from "types/sites"

import { apiService } from "./ApiService"

export const getAllSites = async (): Promise<SiteDataRequest> => {
  const endpoint = `/sites`
  return apiService.get(endpoint).then((res) => res.data)
}

// This is a post request because the frontend needs to send
// a list of sites to request for which is not doable with GET
// request. However, in the future after migration of users to
// email login, the list of sites can be removed in favor of a
// db query. In that case the query method can be changed to GET.
export const getSitePreview = async (
  sites: string[]
): Promise<SitePreviewRequest[]> => {
  const endpoint = `/sites/preview`
  return apiService.post(endpoint, { sites }).then((res) => res.data)
}
