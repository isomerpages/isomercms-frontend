import { useContext } from "react"
import { useQuery } from "react-query"

import { ServicesContext } from "contexts/ServicesContext"

import { MEDIA_CONTENT_KEY } from "hooks/queryKeys"

import { useErrorToast } from "utils/toasts"

import { DEFAULT_RETRY_MSG } from "utils"

export function useGetMediaHook(params, queryParams) {
  const { mediaService } = useContext(ServicesContext)
  const errorToast = useErrorToast()
  return useQuery(
    [MEDIA_CONTENT_KEY, { ...params }],
    () => mediaService.get(params),
    {
      ...queryParams,
      retry: false,
      onError: () => {
        errorToast({
          description: `The media file could not be retrieved. ${DEFAULT_RETRY_MSG}`,
        })
        if (queryParams && queryParams.onError) queryParams.onError()
      },
    }
  )
}
