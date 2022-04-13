import { useContext } from "react"
import { useMutation, useQueryClient } from "react-query"

import { ServicesContext } from "contexts/ServicesContext"

import { DIR_CONTENT_KEY } from "hooks/queryKeys"

import { successToast, errorToast } from "utils/toasts"

import { DEFAULT_RETRY_MSG } from "utils"

export function useReorderDirectoryHook(params, queryParams) {
  const queryClient = useQueryClient()
  const { directoryService } = useContext(ServicesContext)
  return useMutation((body) => directoryService.reorder(params, body), {
    ...queryParams,
    onError: () => {
      errorToast(
        `Your directory order could not be saved. ${DEFAULT_RETRY_MSG}`
      )
      if (queryParams && queryParams.onError) queryParams.onError()
    },
    onSuccess: () => {
      queryClient.invalidateQueries([DIR_CONTENT_KEY, { ...params }])
      successToast("Successfully updated directory order")
      if (queryParams && queryParams.onSuccess) queryParams.onSuccess()
    },
  })
}
