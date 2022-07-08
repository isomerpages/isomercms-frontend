import { useQuery, UseQueryOptions, UseQueryResult } from "react-query"

import { DIR_CONTENT_KEY } from "constants/queryKeys"

import useRedirectHook from "hooks/useRedirectHook"

import * as DirectoryService from "services/DirectoryService/index"

import { isAxiosError } from "utils/axios"
import { useErrorToast } from "utils/toasts"

import { PageData } from "types/directory"
import { DEFAULT_RETRY_MSG } from "utils"

export const useGetWorkspacePages = (
  siteName: string,
  queryOptions?: Omit<UseQueryOptions<PageData[]>, "queryFn" | "queryKey">
): UseQueryResult<PageData[]> => {
  const { setRedirectToNotFound } = useRedirectHook()
  const errorToast = useErrorToast()

  return useQuery<PageData[]>(
    // NOTE: The isUnlinked is required so that the query key is unique;
    // Otherwise, this would have the same query key as useGetWorkspace
    [DIR_CONTENT_KEY, { siteName, isUnlinked: true }],
    () => DirectoryService.getWorkspacePages(siteName),
    {
      ...queryOptions,
      retry: false,
      onError: (err) => {
        console.log(err)
        if (isAxiosError(err) && err.response && err.response.status === 404) {
          setRedirectToNotFound()
        } else {
          errorToast({
            description: `There was a problem retrieving ungrouped pages. ${DEFAULT_RETRY_MSG}`,
          })
        }
        queryOptions?.onError?.(err)
      },
    }
  )
}
