import { useQuery, UseQueryOptions, UseQueryResult } from "react-query"

import { RESOURCE_ROOM_CONTENT_KEY } from "constants/queryKeys"

import useRedirectHook from "hooks/useRedirectHook"

import * as DirectoryService from "services/DirectoryService/index"

import { isAxiosError } from "utils/axios"
import { useErrorToast } from "utils/toasts"

import { DirectoryData } from "types/directory"
import { ResourceRoomRouteParams } from "types/resources"
import { DEFAULT_RETRY_MSG } from "utils"

export const useGetResourceRoom = (
  params: ResourceRoomRouteParams,
  queryOptions?: Omit<UseQueryOptions<DirectoryData[]>, "queryFn" | "queryKey">
): UseQueryResult<DirectoryData[]> => {
  const { setRedirectToNotFound } = useRedirectHook()
  const errorToast = useErrorToast()

  return useQuery<DirectoryData[]>(
    [RESOURCE_ROOM_CONTENT_KEY, params],
    () => DirectoryService.getResourceRoom(params),
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
        queryOptions?.onError?.(err)
      },
    }
  )
}
