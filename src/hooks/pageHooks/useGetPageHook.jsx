import { useContext } from "react"
import { useQuery } from "react-query"

import { PAGE_CONTENT_KEY } from "constants/queryKeys"

import { ServicesContext } from "contexts/ServicesContext"

import { useErrorToast } from "utils/toasts"

import { DEFAULT_RETRY_MSG } from "utils"

export function useGetPageHook(params, queryParams) {
  const { pageService } = useContext(ServicesContext)
  const errorToast = useErrorToast
  return useQuery(
    [PAGE_CONTENT_KEY, { ...params }],
    () => pageService.get(params),
    {
      ...queryParams,
      retry: false,
      onError: () => {
        errorToast({
          description: `The page data could not be retrieved. ${DEFAULT_RETRY_MSG}`,
        })
        if (queryParams && queryParams.onError) queryParams.onError()
      },
    }
  )
}
