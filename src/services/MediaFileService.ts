import { MediaData } from "types/directory"

import { apiService } from "./ApiService"

export const getMediaFile = (
  siteName: string,
  mediaDirectoryName: string,
  fileName: string
): Promise<MediaData> => {
  const endpoint = `/sites/${siteName}/media/${mediaDirectoryName}/pages/${fileName}`
  return apiService.get<MediaData>(endpoint).then(({ data }) => data)
}
