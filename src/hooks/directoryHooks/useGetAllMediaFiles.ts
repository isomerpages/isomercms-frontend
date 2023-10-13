import { UseQueryResult, useQueries } from "react-query"

import { GET_ALL_MEDIA_FILES_KEY } from "constants/queryKeys"

import * as MediaFileService from "services/MediaFileService"

import { MediaData, MediaFilePathData } from "types/directory"

export const useGetAllMediaFiles = (
  files: MediaFilePathData[],
  siteName: string,
  directoryName: string
): UseQueryResult<MediaData>[] => {
  const mediaQueries = files.map(({ name }) => ({
    queryKey: [GET_ALL_MEDIA_FILES_KEY, { siteName, directoryName, name }],
    queryFn: () => MediaFileService.getMediaFile(siteName, directoryName, name),
  }))

  // NOTE: Cast is required here because the library types it as an `unknown` return.
  return useQueries<MediaData[]>(mediaQueries) as UseQueryResult<MediaData>[]
}
