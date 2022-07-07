import { DirectoryInfoReturn, DirectoryData } from "types/directory"
import { ResourceRoomOptions } from "types/resources"

import { apiService } from "../ApiService"

import { getResourcesEndpoint } from "./utils"

export const createResourceRoom = (
  siteName: string,
  { newDirectoryName, items }: DirectoryInfoReturn
): Promise<void> => {
  const endpoint = `/sites/${siteName}/resourceRoom/`
  const body = {
    items,
    newDirectoryName,
  }
  return apiService.post(endpoint, body)
}

export const getResourceRoom = (
  siteName: string,
  options?: Partial<ResourceRoomOptions>
): Promise<DirectoryData[]> => {
  const endpoint = getResourcesEndpoint(
    siteName,
    options?.resourceRoomName,
    options?.resourceCategoryName,
    options?.isCreate
  )
  return apiService.get<DirectoryData[]>(endpoint).then(({ data }) => data)
}
