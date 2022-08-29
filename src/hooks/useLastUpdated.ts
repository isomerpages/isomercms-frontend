import { useQuery } from "react-query"

import { LAST_UPDATED_KEY } from "constants/queryKeys"

import { getLastUpdated } from "api"

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
