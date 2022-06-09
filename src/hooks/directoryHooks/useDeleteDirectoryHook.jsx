import _ from "lodash"
import { useContext } from "react"
import { useMutation, useQueryClient } from "react-query"

import { ServicesContext } from "contexts/ServicesContext"

import { DIR_CONTENT_KEY } from "hooks/queryKeys"

import { useSuccessToast, useErrorToast } from "utils/toasts"

import { DEFAULT_RETRY_MSG, getMediaDirectoryName } from "utils"

// eslint-disable-next-line import/prefer-default-export
export function useDeleteDirectoryHook(params, queryParams) {
  const { directoryService } = useContext(ServicesContext)
  const queryClient = useQueryClient()
  const successToast = useSuccessToast()
  const errorToast = useErrorToast()
  return useMutation(() => directoryService.delete(params), {
    ...queryParams,
    onError: () => {
      errorToast({
        description: `Your directory could not be deleted. ${DEFAULT_RETRY_MSG}`,
      })
      if (queryParams && queryParams.onError) queryParams.onError()
    },
    onSuccess: () => {
      successToast({
        description: `Successfully deleted directory!`,
      })
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
          _.omit(params, "subCollectionName"),
        ])
      else if (params.collectionName)
        queryClient.invalidateQueries([
          DIR_CONTENT_KEY,
          _.omit(params, "collectionName"),
        ])
      else if (params.resourceCategoryName)
        queryClient.invalidateQueries([
          DIR_CONTENT_KEY,
          _.omit(params, "resourceCategoryName"),
        ])
      if (queryParams && queryParams.onSuccess) queryParams.onSuccess()
    },
  })
}
