import { useContext } from "react"
import { useMutation, useQueryClient } from "react-query"

import { ServicesContext } from "contexts/ServicesContext"

import { DIR_CONTENT_KEY } from "hooks/queryKeys"

import { successToast, errorToast } from "utils/toasts"

import { DEFAULT_RETRY_MSG } from "utils"

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
      if (params.subCollectionName)
        queryClient.invalidateQueries([
          DIR_CONTENT_KEY,
          (({ subCollectionName, ...p }) => p)(params),
        ])
      else if (params.collectionName)
        queryClient.invalidateQueries([
          DIR_CONTENT_KEY,
          (({ collectionName, ...p }) => p)(params),
        ])
      else if (params.resourceCategoryName)
        queryClient.invalidateQueries([
          DIR_CONTENT_KEY,
          (({ resourceCategoryName, ...p }) => p)(params),
        ])
      successToast("Successfully updated directory settings")
      queryParams && queryParams.onSuccess && queryParams.onSuccess()
    },
  })
}
