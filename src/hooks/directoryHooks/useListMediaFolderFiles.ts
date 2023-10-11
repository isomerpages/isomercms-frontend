import { useQuery, UseQueryOptions, UseQueryResult } from "react-query"

import { LIST_MEDIA_DIRECTORY_FILES_KEY } from "constants/queryKeys"

import useRedirectHook from "hooks/useRedirectHook"

import * as DirectoryService from "services/DirectoryService/index"

import { isAxiosError } from "utils/axios"
import { useErrorToast } from "utils/toasts"

import { GetMediaFilesDto } from "types/directory"
import { MediaDirectoryParams } from "types/folders"
import { DEFAULT_RETRY_MSG } from "utils"

export const useListMediaFolderFiles = (
  params: MediaDirectoryParams,
  queryOptions?: Omit<UseQueryOptions<GetMediaFilesDto>, "queryFn" | "queryKey">
): UseQueryResult<GetMediaFilesDto> => {
  const { setRedirectToNotFound } = useRedirectHook()
  const errorToast = useErrorToast()

  return useQuery<GetMediaFilesDto>(
    [LIST_MEDIA_DIRECTORY_FILES_KEY, params],
    () => DirectoryService.getMediaFolderFiles(params),
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
