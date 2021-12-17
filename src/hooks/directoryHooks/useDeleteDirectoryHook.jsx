import { useContext } from "react"
import { useMutation, useQueryClient } from "react-query"

import { ServicesContext } from "contexts/ServicesContext"

import { DIR_CONTENT_KEY } from "hooks/queryKeys"

import { successToast, errorToast } from "utils/toasts"

import { DEFAULT_RETRY_MSG, getMediaDirectoryName } from "utils"

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
      if (params.mediaDirectoryName)
        queryClient.invalidateQueries([
          DIR_CONTENT_KEY,
          {
            ...params,
            mediaDirectoryName: getMediaDirectoryName(
              params.mediaDirectoryName,
              { end: -1 }
            ),
          },
        ])
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
      queryParams && queryParams.onSuccess && queryParams.onSuccess()
    },
  })
}
