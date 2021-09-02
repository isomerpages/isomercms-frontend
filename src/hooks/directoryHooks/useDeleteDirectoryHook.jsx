import { useContext } from "react"
import { useMutation, useQueryClient } from "react-query"
import { DEFAULT_RETRY_MSG } from "../../utils"
import { successToast, errorToast } from "../../utils/toasts"
import { DIR_CONTENT_KEY } from "../queryKeys"

import { ServicesContext } from "../../contexts/ServicesContext"

export function useDeleteDirectoryHook(params, queryParams) {
  const { directoryService } = useContext(ServicesContext)
  const queryClient = useQueryClient()
  return useMutation(() => directoryService.delete(params), {
    ...queryParams,
    onError: () => {
      errorToast(`Your directory could not be deleted. ${DEFAULT_RETRY_MSG}`)
      queryParams && queryParams.onError && queryParams.onError()
    },
    onSuccess: () => {
      successToast(`Successfully deleted directory`)
      queryClient.invalidateQueries([
        DIR_CONTENT_KEY,
        (({ subCollectionName, ...p }) => p)(params),
      ])
      queryParams && queryParams.onSuccess && queryParams.onSuccess()
    },
  })
}
