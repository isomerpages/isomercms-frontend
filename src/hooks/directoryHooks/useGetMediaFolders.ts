import { useQuery, UseQueryOptions, UseQueryResult } from "react-query"

import { LIST_ALL_MEDIA_KEY } from "constants/queryKeys"

import useRedirectHook from "hooks/useRedirectHook"

import * as DirectoryService from "services/DirectoryService/index"

import { isAxiosError } from "utils/axios"
import { useErrorToast } from "utils/toasts"

import { DirectoryData, GetMediaFoldersDto, MediaData } from "types/directory"
import { MediaDirectoryParams } from "types/folders"
import { DEFAULT_RETRY_MSG } from "utils"

// NOTE: This is a helper method to smooth over
// the extraction of medias data from the response.
// This is done to avoid scope creep as the medias data
// expected by our legacy component is a mix of directories + files.
// TODO: Migrate the call sites that use this helper to instead
// accept both directories and files
export const getMediasData = (
  data?: GetMediaFoldersDto // NOTE: optional as the initial value from react-query is undefined
): (DirectoryData | MediaData)[] => {
  if (!data) return []

  const { directories, files } = data

  return [...directories, ...files]
}

export const useGetMediaFolders = (
  params: MediaDirectoryParams,
  queryOptions?: Omit<
    UseQueryOptions<(DirectoryData | MediaData)[]>,
    "queryFn" | "queryKey"
  >
): UseQueryResult<(DirectoryData | MediaData)[]> => {
  const { setRedirectToNotFound } = useRedirectHook()
  const errorToast = useErrorToast()

  return useQuery<(DirectoryData | MediaData)[]>(
    [LIST_ALL_MEDIA_KEY, params],
    () => DirectoryService.getMediaData(params),
    {
      ...queryOptions,
      retry: false,
      onError: (err) => {
        console.log(err)
        if (isAxiosError(err) && err.response && err.response.status === 404) {
          setRedirectToNotFound()
        } else {
          errorToast({
            id: "get-media-directory-error",
            description: `There was a problem retrieving directory contents. ${DEFAULT_RETRY_MSG}`,
          })
        }
        queryOptions?.onError?.(err)
      },
    }
  )
}
