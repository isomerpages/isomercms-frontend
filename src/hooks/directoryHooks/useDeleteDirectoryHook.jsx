import _ from "lodash"
import { useContext } from "react"
import { useMutation, useQueryClient } from "react-query"

import {
  DIR_CONTENT_KEY,
  RESOURCE_ROOM_CONTENT_KEY,
  LIST_MEDIA_FOLDERS_KEY,
  RESOURCE_CATEGORY_CONTENT_KEY,
} from "constants/queryKeys"

import { ServicesContext } from "contexts/ServicesContext"

import { getMediaDirectoryName } from "utils/media"
import { useSuccessToast, useErrorToast } from "utils/toasts"

import { DEFAULT_RETRY_MSG } from "utils"

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
        id: "delete-directory-error",
        description: `Your item could not be deleted. ${DEFAULT_RETRY_MSG}`,
      })
      if (queryParams && queryParams.onError) queryParams.onError()
    },
    onSuccess: () => {
      successToast({
        id: "delete-directory-success",
        description: `Successfully deleted item!`,
      })
      if (params.mediaDirectoryName) {
        const invalidationParams = {
          ...params,
          mediaDirectoryName: getMediaDirectoryName(params.mediaDirectoryName, {
            end: -1,
          }),
        }
        queryClient.invalidateQueries([DIR_CONTENT_KEY, invalidationParams])
        queryClient.invalidateQueries([
          LIST_MEDIA_FOLDERS_KEY,
          invalidationParams,
        ])
      }
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
      else if (params.resourceCategoryName) {
        queryClient.invalidateQueries([
          RESOURCE_CATEGORY_CONTENT_KEY,
          _.omit(params, "resourceRoomName"),
        ])
        queryClient.invalidateQueries([
          RESOURCE_ROOM_CONTENT_KEY,
          _.omit(params, "resourceCategoryName"),
        ])
      }
      if (queryParams && queryParams.onSuccess) queryParams.onSuccess()
    },
  })
}
