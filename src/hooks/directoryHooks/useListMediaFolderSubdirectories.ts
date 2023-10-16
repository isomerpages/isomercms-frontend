import { useQuery, UseQueryOptions, UseQueryResult } from "react-query"

import { LIST_MEDIA_FOLDERS_KEY } from "constants/queryKeys"

import useRedirectHook from "hooks/useRedirectHook"

import * as DirectoryService from "services/DirectoryService/index"

import { isAxiosError } from "utils/axios"
import { useErrorToast } from "utils/toasts"

import { GetMediaSubdirectoriesDto } from "types/directory"
import { MediaDirectoryParams } from "types/folders"
import { DEFAULT_RETRY_MSG } from "utils"

export const useListMediaFolderSubdirectories = (
  params: Omit<MediaDirectoryParams, "curPage">,
  queryOptions?: Omit<
    UseQueryOptions<GetMediaSubdirectoriesDto>,
    "queryFn" | "queryKey"
  >
): UseQueryResult<GetMediaSubdirectoriesDto> => {
  const { setRedirectToNotFound } = useRedirectHook()
  const errorToast = useErrorToast()

  return useQuery<GetMediaSubdirectoriesDto>(
    [LIST_MEDIA_FOLDERS_KEY, params],
    () => DirectoryService.getMediaFolderSubdirectories(params),
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
            description: `There was a problem retrieving the sub-directories for ${params.mediaDirectoryName}. ${DEFAULT_RETRY_MSG}`,
          })
        }
        queryOptions?.onError?.(err)
      },
    }
  )
}
