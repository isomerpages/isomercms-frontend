import { useQuery, UseQueryOptions, UseQueryResult } from "react-query"

import { MEDIA_MULTIPLE_CONTENT_KEY } from "constants/queryKeys"

import { apiService } from "services/ApiService"

import { MediaService } from "services"
import { MediaData } from "types/directory"
import { MultipleMediaParams } from "types/media"

const getMultipleMedia = (params: MultipleMediaParams) => {
  const mediaService = new MediaService({ apiClient: apiService })

  return Promise.all(
    params.mediaSrcs.map((mediaSrc) => {
      const mediaUrlTokens = mediaSrc.split("/")
      // Note: The mediaUrl will always start with a "/"
      const mediaDirectoryName = mediaUrlTokens.slice(1, -1).join("%2F")
      const fileName = mediaUrlTokens.pop()

      const reqParams = {
        siteName: params.siteName,
        mediaDirectoryName,
        fileName,
      }

      return mediaService.get(reqParams).catch((error) => {
        // It is possible for the user to specify a media that does not exist
        // and we will automatically load the placeholder image for them
        // The error needs to be caught here so that other images can still
        // load, as Promise.all will fail if any of the promises fail
        return error
      }) as Promise<MediaData>
    })
  )
}

export const useGetMultipleMediaHook = (
  params: MultipleMediaParams,
  queryOptions?: Omit<UseQueryOptions<MediaData[]>, "queryFn" | "queryKey">
): UseQueryResult<MediaData[]> => {
  return useQuery<MediaData[]>(
    [MEDIA_MULTIPLE_CONTENT_KEY, params],
    () => getMultipleMedia(params),
    {
      ...queryOptions,
      retry: false,
    }
  )
}
