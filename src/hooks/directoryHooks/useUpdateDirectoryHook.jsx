import _ from "lodash"
import { useContext } from "react"
import { useMutation, useQueryClient } from "react-query"

import { DIR_CONTENT_KEY, RESOURCE_ROOM_CONTENT_KEY } from "constants/queryKeys"

import { ServicesContext } from "contexts/ServicesContext"

import { useSuccessToast, useErrorToast } from "utils/toasts"

import { DEFAULT_RETRY_MSG, getMediaDirectoryName } from "utils"

import { extractUpdateDirectoryInfo } from "./utils"

export function useUpdateDirectoryHook(params, queryParams) {
  const queryClient = useQueryClient()
  const { directoryService } = useContext(ServicesContext)
  const successToast = useSuccessToast()
  const errorToast = useErrorToast()
  return useMutation(
    (body) => {
      const { newDirectoryName } = extractUpdateDirectoryInfo(body)
      return directoryService.update(params, { newDirectoryName })
    },
    {
      ...queryParams,
      onError: () => {
        errorToast({
          description: `Your directory settings could not be saved. ${DEFAULT_RETRY_MSG}`,
        })
        if (queryParams && queryParams.onError) queryParams.onError()
      },
      onSuccess: () => {
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
          queryClient.invalidateQueries([RESOURCE_ROOM_CONTENT_KEY])
        else if (params.mediaDirectoryName)
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
        successToast({
          description: `Successfully updated directory settings!`,
        })
        if (queryParams && queryParams.onSuccess) queryParams.onSuccess()
      },
    }
  )
}
