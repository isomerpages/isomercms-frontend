import { useQuery, UseQueryOptions, UseQueryResult } from "react-query"

import { LAST_UPDATED_KEY } from "constants/queryKeys"

import useRedirectHook from "hooks/useRedirectHook"

import * as SiteDashboardService from "services/SiteDashboardService"

import { isAxiosError } from "utils/axios"
import { convertUtcToTimeDiff } from "utils/dateUtils"
import { useErrorToast } from "utils/toasts"

const getRelativeLastUpdated = (siteName: string) => {
  return SiteDashboardService.getLastUpdated(siteName).then((res) => {
    return convertUtcToTimeDiff(res.lastUpdated)
  })
}

export const useGetLastUpdated = (
  siteName: string,
  queryOptions?: Omit<UseQueryOptions<string>, "queryFn" | "queryKey">
): UseQueryResult<string> => {
  const { setRedirectToNotFound } = useRedirectHook()
  const errorToast = useErrorToast()

  return useQuery<string>(
    [LAST_UPDATED_KEY, siteName],
    () => getRelativeLastUpdated(siteName),
    {
      ...queryOptions,
      retry: false,
      onError: (err) => {
        console.log(err)
        if (isAxiosError(err) && err.response && err.response.status === 404) {
          setRedirectToNotFound()
        } else {
          errorToast({
            id: "get-last-updated-error",
            description: `There was a problem retrieving the site last updated time.`,
          })
          queryOptions?.onError?.(err)
        }
      },
    }
  )
}
