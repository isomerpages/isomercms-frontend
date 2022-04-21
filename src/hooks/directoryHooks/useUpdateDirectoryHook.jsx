import _ from "lodash"
import { useContext } from "react"
import { useMutation, useQueryClient } from "react-query"

import { ServicesContext } from "contexts/ServicesContext"

import { DIR_CONTENT_KEY } from "hooks/queryKeys"

import { successToast, errorToast } from "utils/toasts"

import { DEFAULT_RETRY_MSG, getMediaDirectoryName } from "utils"

import { retrieveUpdateDirectoryInfo } from "./utils"

export function useUpdateDirectoryHook(params, queryParams) {
  const queryClient = useQueryClient()
  const { directoryService } = useContext(ServicesContext)
  return useMutation(
    (body) => {
      const { newDirectoryName } = retrieveUpdateDirectoryInfo(body)
      return directoryService.update(params, { newDirectoryName })
    },
    {
      ...queryParams,
      onError: () => {
        errorToast(
          `Your directory settings could not be saved. ${DEFAULT_RETRY_MSG}`
        )
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
          queryClient.invalidateQueries([
            DIR_CONTENT_KEY,
            _.omit(params, "resourceCategoryName"),
          ])
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
        successToast("Successfully updated directory settings")
        if (queryParams && queryParams.onSuccess) queryParams.onSuccess()
      },
    }
  )
}
