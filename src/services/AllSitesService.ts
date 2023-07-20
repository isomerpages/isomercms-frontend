import { SiteDataRequest, SitePreviewRequest } from "types/sites"

import { apiService } from "./ApiService"

export const getAllSites = async (): Promise<SiteDataRequest> => {
  const endpoint = `/sites`
  return apiService.get(endpoint).then((res) => res.data)
}

export const getSitePreview = async (
  sites: string[]
): Promise<SitePreviewRequest[]> => {
  const endpoint = `/sites/preview`
  return apiService.post(endpoint, { sites }).then((res) => res.data)
}
