import { useContext } from "react"
import { useMutation, useQueryClient } from "react-query"
import { DEFAULT_RETRY_MSG } from "../../utils"
import { successToast, errorToast } from "../../utils/toasts"
import { DIR_CONTENT_KEY } from "../queryKeys"

import { ServicesContext } from "../../contexts/ServicesContext"

export function useUpdateDirectoryHook(params, queryParams) {
  const queryClient = useQueryClient()
  const { directoryService } = useContext(ServicesContext)
  return useMutation((body) => directoryService.update(params, body), {
    ...queryParams,
    onError: () => {
      errorToast(
        `Your directory settings could not be saved. ${DEFAULT_RETRY_MSG}`
      )
      queryParams && queryParams.onError && queryParams.onError()
    },
    onSuccess: () => {
      queryClient.invalidateQueries([
        DIR_CONTENT_KEY,
        (({ subCollectionName, ...p }) => p)(params),
      ])
      successToast("Successfully updated directory settings")
      queryParams && queryParams.onSuccess && queryParams.onSuccess()
    },
  })
}
