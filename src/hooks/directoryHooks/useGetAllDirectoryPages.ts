import { useQuery, UseQueryOptions, UseQueryResult } from "react-query"

import { DIR_CONTENT_KEY } from "constants/queryKeys"

import useRedirectHook from "hooks/useRedirectHook"

import * as DirectoryService from "services/DirectoryService/index"

import { isAxiosError } from "utils/axios"
import { useErrorToast } from "utils/toasts"

import { DirectoryParams } from "types/folders"
import { DEFAULT_RETRY_MSG } from "utils"

const getDirectoryPages = (params: DirectoryParams): Promise<string[]> => {
  const { siteName, collectionName } = params
  const collectionParams = {
    siteName,
    collectionName,
  }
  return DirectoryService.getCollection(collectionParams).then((data) => {
    return data
      .map((item) => {
        if (item.type === "file") {
          return item.name
        }
        return item.children.map((child) => `${item.name}/${child}`)
      })
      .flatMap((item) => item)
  })
}

export const useGetAllDirectoryPages = (
  params: DirectoryParams,
  queryOptions?: Omit<UseQueryOptions<string[]>, "queryFn" | "queryKey">
): UseQueryResult<string[]> => {
  const { setRedirectToNotFound } = useRedirectHook()
  const errorToast = useErrorToast()

  return useQuery<string[]>(
    [DIR_CONTENT_KEY, params],
    () => getDirectoryPages(params),
    {
      ...queryOptions,
      retry: false,
      onError: (err) => {
        console.log(err)
        if (isAxiosError(err) && err.response && err.response.status === 404) {
          setRedirectToNotFound()
        } else {
          errorToast({
            id: "get-all-directory-pages-error",
            description: `There was a problem trying to load your directory. ${DEFAULT_RETRY_MSG}`,
          })
        }
        queryOptions?.onError?.(err)
      },
    }
  )
}
