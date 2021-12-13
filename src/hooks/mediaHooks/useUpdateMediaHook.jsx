import { useContext } from "react"
import { useMutation, useQueryClient } from "react-query"

import { ServicesContext } from "contexts/ServicesContext"

import { DIR_CONTENT_KEY, MEDIA_CONTENT_KEY } from "hooks/queryKeys"

import { errorToast, successToast } from "utils/toasts"

import { DEFAULT_RETRY_MSG } from "utils"

export function useUpdateMediaHook(params, queryParams) {
  const queryClient = useQueryClient()
  const { mediaService } = useContext(ServicesContext)
  return useMutation((body) => mediaService.update(params, body), {
    ...queryParams,
    onSettled: () => {
      queryClient.invalidateQueries([MEDIA_CONTENT_KEY, { ...params }])
    },
    onSuccess: () => {
      if (params.mediaRoom || params.mediaDirectoryName)
        queryClient.invalidateQueries([
          // invalidates media directory
          DIR_CONTENT_KEY,
          (({ fileName, ...p }) => p)(params),
        ])
      successToast(`Successfully updated media file!`)
      queryParams && queryParams.onSuccess && queryParams.onSuccess()
    },
    onError: (err) => {
      if (err.response.status !== 409)
        errorToast(`Your media file could not be updated. ${DEFAULT_RETRY_MSG}`)
      queryParams && queryParams.onError && queryParams.onError(err)
    },
  })
}
