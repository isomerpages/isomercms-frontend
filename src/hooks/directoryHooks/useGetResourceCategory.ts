import {
  useQuery,
  useQueryClient,
  UseQueryOptions,
  UseQueryResult,
} from "react-query"

import { RESOURCE_CATEGORY_CONTENT_KEY } from "constants/queryKeys"

import useRedirectHook from "hooks/useRedirectHook"

import * as DirectoryService from "services/DirectoryService/index"

import { isAxiosError } from "utils/axios"
import { useErrorToast } from "utils/toasts"

import { ResourcePageData } from "types/directory"
import { DEFAULT_RETRY_MSG } from "utils"

export const useGetResourceCategory = (
  siteName: string,
  resourceRoomName: string,
  resourceCategoryName: string,
  queryOptions?: Omit<
    UseQueryOptions<ResourcePageData[]>,
    "queryFn" | "queryKey"
  >
): UseQueryResult<ResourcePageData[]> => {
  const { setRedirectToNotFound } = useRedirectHook()
  const queryClient = useQueryClient()
  const errorToast = useErrorToast()

  return useQuery<ResourcePageData[]>(
    [RESOURCE_CATEGORY_CONTENT_KEY],
    () =>
      DirectoryService.getResourceCategory(
        siteName,
        resourceRoomName,
        resourceCategoryName
      ),
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
      onSuccess: (data) => {
        queryClient.invalidateQueries(RESOURCE_CATEGORY_CONTENT_KEY)
        queryOptions?.onSuccess?.(data)
      },
    }
  )
}
