import { useQuery } from "react-query"

import { getLastUpdated } from "api"

import { LAST_UPDATED_KEY } from "./queryKeys"

interface useLastUpdatedReturn {
  lastUpdated?: string
  isError: boolean
  isLoading: boolean
  isSuccess: boolean
}

export const useLastUpdated = (siteName: string): useLastUpdatedReturn => {
  const { data: lastUpdatedResp, isLoading, isError, isSuccess } = useQuery(
    [LAST_UPDATED_KEY, siteName],
    () => getLastUpdated(siteName),
    {
      retry: false,
      onError: (err) => {
        console.log(err)
      },
    }
  )

  return {
    lastUpdated: !isLoading && lastUpdatedResp?.lastUpdated,
    isLoading,
    isError,
    isSuccess,
  }
}
