import {
  DirectoryInfoReturn,
  DirectoryData,
  ResourcePageData,
  PageData,
  ResourceRoomNameUpdateProps,
  GetMediaFoldersDto,
  GetMediaSubdirectoriesDto,
  GetMediaFilesDto,
} from "types/directory"
import { MediaDirectoryParams, PageDirectoryParams } from "types/folders"
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
}: PageDirectoryParams): Promise<(PageData | DirectoryData)[]> => {
  let endpoint = `/sites/${siteName}/collections`
  if (collectionName) {
    endpoint += `/${collectionName}`
  }
  if (subCollectionName) {
    endpoint += `/subcollections/${subCollectionName}`
  }
  return apiService.get<DirectoryData[]>(endpoint).then(({ data }) => data)
}

export const getWorkspacePages = (siteName: string): Promise<PageData[]> => {
  const endpoint = `/sites/${siteName}/pages`
  return apiService.get<PageData[]>(endpoint).then(({ data }) => data)
}

export const getMediaData = ({
  siteName,
  mediaDirectoryName,
  // NOTE: These defaults are set to adhere to our current behaviour.
  // Github has a fixed upper limit of 1000 items and we return
  // every item up to the upper limit.
  // Hence, this behaviour is essentially a single page of up to 1000 items.
  curPage = 1,
  limit = 1000,
}: MediaDirectoryParams): Promise<GetMediaFoldersDto> => {
  const endpoint = `/sites/${siteName}/media/${mediaDirectoryName}`
  return apiService
    .get<GetMediaFoldersDto>(endpoint, {
      params: { page: curPage, limit },
    })
    .then(({ data }) => data)
}

export const getMediaFolderSubdirectories = ({
  siteName,
  mediaDirectoryName,
}: Omit<
  MediaDirectoryParams,
  "curPage"
>): Promise<GetMediaSubdirectoriesDto> => {
  const endpoint = `/sites/${siteName}/media/${mediaDirectoryName}/subdirectories`
  return apiService
    .get<GetMediaSubdirectoriesDto>(endpoint)
    .then(({ data }) => data)
}

export const getMediaFolderFiles = ({
  siteName,
  mediaDirectoryName,
  curPage,
}: MediaDirectoryParams): Promise<GetMediaFilesDto> => {
  const endpoint = `/sites/${siteName}/media/${mediaDirectoryName}/files`
  return apiService
    .get<GetMediaFilesDto>(endpoint, {
      params: { page: curPage },
    })
    .then(({ data }) => data)
}

export const getResourceRoomName = async (
  siteName: string
): Promise<string> => {
  const resp = await apiService.get<{ resourceRoomName: string }>(
    `/sites/${siteName}/resourceRoom`
  )
  const { resourceRoomName } = resp.data
  return resourceRoomName
}

export const updateResourceRoomName = async (
  siteName: string,
  resourceRoomName: string,
  body: ResourceRoomNameUpdateProps
): Promise<void> => {
  const endpoint = `/sites/${siteName}/resourceRoom/${resourceRoomName}`
  return apiService.post(endpoint, body)
}
