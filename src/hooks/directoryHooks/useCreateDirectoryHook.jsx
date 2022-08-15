import { useContext } from "react"
import { useMutation, useQueryClient } from "react-query"

import { DIR_CONTENT_KEY } from "constants/queryKeys"

import { ServicesContext } from "contexts/ServicesContext"

import useRedirectHook from "hooks/useRedirectHook"

import { useErrorToast } from "utils/toasts"

import { getRedirectUrl, DEFAULT_RETRY_MSG } from "utils"

import { extractCreateDirectoryInfo } from "./utils"

// eslint-disable-next-line import/prefer-default-export
export function useCreateDirectoryHook(params, queryParams) {
  const queryClient = useQueryClient()
  const { directoryService } = useContext(ServicesContext)
  const { setRedirectToPage } = useRedirectHook()
  const errorToast = useErrorToast()
  return useMutation(
    (body) => {
      const { newDirectoryName, items } = extractCreateDirectoryInfo(body)
      return directoryService.create(
        { ...params, isCreate: true },
        { newDirectoryName, items }
      )
    },
    {
      ...queryParams,
      retry: false,
      onError: () => {
        errorToast({
          description: `A new directory could not be created. ${DEFAULT_RETRY_MSG}`,
        })
        if (queryParams && queryParams.onError) queryParams.onError()
      },
      onSuccess: (resp) => {
        queryClient.invalidateQueries([DIR_CONTENT_KEY, { ...params }])
        setRedirectToPage(
          getRedirectUrl({
            mediaDirectoryPath: params.mediaDirectoryName
              ? resp.data.newDirectoryName
              : "",
            resourceRoomName: params.isResource
              ? resp.data.newDirectoryName
              : "",
            resourceCategoryName: params.resourceRoomName
              ? resp.data.newDirectoryName
              : "",
            collectionName: !params.isResource
              ? resp.data.newDirectoryName
              : "",
            subCollectionName:
              params.collectionName && resp.data.newDirectoryName,
            ...params,
          })
        )
        if (queryParams && queryParams.onSuccess) queryParams.onSuccess()
      },
    }
  )
}
