import {
  DirectoryInfoReturn,
  DirectoryData,
  ResourcePageData,
  PageData,
} from "types/directory"
import { FolderUrlParams, MediaDirectoryParams } from "types/folders"
import {
  ResourceCategoryRouteParams,
  ResourcesRouteParams,
} from "types/resources"

import { apiService } from "../ApiService"

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

export const getResourceRoom = ({
  siteName,
  resourceRoomName,
}: ResourcesRouteParams): Promise<DirectoryData[]> => {
  const endpoint = `/sites/${siteName}/resourceRoom/${resourceRoomName}`
  return apiService.get<DirectoryData[]>(endpoint).then(({ data }) => data)
}

export const getResourceCategory = ({
  siteName,
  resourceRoomName,
  resourceCategoryName,
}: ResourceCategoryRouteParams): Promise<ResourcePageData[]> => {
  const endpoint = `/sites/${siteName}/resourceRoom/${resourceRoomName}/resources/${resourceCategoryName}`
  return apiService.get<ResourcePageData[]>(endpoint).then(({ data }) => data)
}

export const getCollection = ({
  siteName,
  collectionName,
  subCollectionName,
}: FolderUrlParams): Promise<DirectoryData[]> => {
  let endpoint = `/sites/${siteName}/collections/${collectionName}`
  if (subCollectionName) {
    endpoint += `/subcollections/${subCollectionName}`
  }
  return apiService.get<DirectoryData[]>(endpoint).then(({ data }) => data)
}

export const getWorkspace = (siteName: string): Promise<DirectoryData[]> => {
  const endpoint = `/sites/${siteName}/collections`
  return apiService.get<DirectoryData[]>(endpoint).then(({ data }) => data)
}

export const getWorkspacePages = (siteName: string): Promise<PageData[]> => {
  const endpoint = `/sites/${siteName}/pages`
  return apiService.get<PageData[]>(endpoint).then(({ data }) => data)
}

export const getMediaFolders = ({
  siteName,
  mediaDirectoryName,
}: MediaDirectoryParams): Promise<DirectoryData[]> => {
  const endpoint = `/sites/${siteName}/media/${mediaDirectoryName}`
  return apiService.get<DirectoryData[]>(endpoint).then(({ data }) => data)
}
