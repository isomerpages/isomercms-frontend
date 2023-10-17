import { useQuery, UseQueryOptions, UseQueryResult } from "react-query"

import { NAVIGATION_CONTENT_KEY } from "constants/queryKeys"

import useRedirectHook from "hooks/useRedirectHook"

import { isAxiosError } from "utils/axios"
import { useErrorToast } from "utils/toasts"

import { NavService } from "services"
import { NavDto } from "types/nav"
import { DEFAULT_RETRY_MSG } from "utils"

export const useGetNavHook = (
  siteName: string,
  queryOptions?: Omit<UseQueryOptions<NavDto>, "queryFn" | "queryKey">
): UseQueryResult<NavDto> => {
  const { setRedirectToNotFound } = useRedirectHook()
  const errorToast = useErrorToast()

  return useQuery<NavDto>(
    [NAVIGATION_CONTENT_KEY, siteName],
    () => NavService.getNav(siteName),
    {
      ...queryOptions,
      retry: false,
      cacheTime: 0, // We want to refetch data on every page load because file order may have changed
      onError: (err) => {
        if (isAxiosError(err) && err.response && err.response.status === 404) {
          setRedirectToNotFound(siteName)
        } else {
          errorToast({
            id: "get-nav-error",
            description: `There was a problem trying to load your navigation data. ${DEFAULT_RETRY_MSG}`,
          })
        }
        queryOptions?.onError?.(err)
      },
    }
  )
}
