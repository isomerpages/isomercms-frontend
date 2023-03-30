import { SiteDataRequest } from "types/sites"

import { apiService } from "./ApiService"

export const getAllSites = async (): Promise<SiteDataRequest> => {
  const endpoint = `/sites`
  return apiService.get(endpoint).then((res) => res.data)
}
