import { useContext } from "react"
import { useMutation, useQueryClient } from "react-query"
import { DEFAULT_RETRY_MSG } from "../../utils"
import { errorToast } from "../../utils/toasts"
import { DIR_CONTENT_KEY } from "../queryKeys"

import { ServicesContext } from "../../contexts/ServicesContext"

export function useCreateDirectoryHook(params, queryParams) {
  const queryClient = useQueryClient()
  const { directoryService } = useContext(ServicesContext)
  return useMutation(
    (body) => directoryService.create({ ...params, isCreate: true }, body),
    {
      ...queryParams,
      retry: false,
      onError: () => {
        errorToast(`A new directory could not be created. ${DEFAULT_RETRY_MSG}`)
        queryParams && queryParams.onError && queryParams.onError()
      },
      onSuccess: () => {
        queryClient.invalidateQueries([DIR_CONTENT_KEY, { ...params }])
        queryParams && queryParams.onSuccess && queryParams.onSuccess()
      },
    }
  )
}
