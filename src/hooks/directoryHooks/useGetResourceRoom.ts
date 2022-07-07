import { useQuery, UseQueryOptions, UseQueryResult } from "react-query"

import { DIR_CONTENT_KEY } from "hooks/queryKeys"
import useRedirectHook from "hooks/useRedirectHook"

import * as DirectoryService from "services/DirectoryService/index"

import { isAxiosError } from "utils/axios"
import { useErrorToast } from "utils/toasts"

import { DirectoryData } from "types/directory"
import { ResourceRoomOptions } from "types/resources"
import { DEFAULT_RETRY_MSG } from "utils"

export const useGetResourceRoom = (
  siteName: string,
  options?: Partial<ResourceRoomOptions>,
  queryOptions?: Omit<UseQueryOptions<DirectoryData[]>, "queryFn" | "queryKey">
): UseQueryResult<DirectoryData[]> => {
  const { setRedirectToNotFound } = useRedirectHook()
  const errorToast = useErrorToast()

  return useQuery<DirectoryData[]>(
    [DIR_CONTENT_KEY],
    () => DirectoryService.getResourceRoom(siteName, options),
    {
      ...queryOptions,
      retry: false,
      onError: (err) => {
        console.log(err)
        if (isAxiosError(err) && err.response && err.response.status === 404) {
          setRedirectToNotFound()
        } else {
          errorToast({
            description: `There was a problem retrieving directory contents. ${DEFAULT_RETRY_MSG}`,
          })
        }
      },
    }
  )
}
