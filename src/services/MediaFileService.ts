import { MediaData } from "types/directory"
import { MediaCreationInfo } from "types/media"

import { apiService } from "./ApiService"

export const getMediaFile = (
  siteName: string,
  mediaDirectoryName: string,
  fileName: string
): Promise<MediaData> => {
  const endpoint = `/sites/${siteName}/media/${mediaDirectoryName}/pages/${fileName}`
  return apiService.get<MediaData>(endpoint).then(({ data }) => data)
}

export const createMediaFile = async (
  siteName: string,
  mediaDirectoryName: string,
  mediaData: MediaCreationInfo
): Promise<MediaData> => {
  const endpoint = `/sites/${siteName}/media/${mediaDirectoryName}/pages`
  return apiService
    .post<MediaData>(endpoint, mediaData)
    .then(({ data }) => data)
}
