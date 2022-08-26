import { useContext } from "react"
import { useMutation, useQueryClient } from "react-query"

import {
  DIR_CONTENT_KEY,
  RESOURCE_CATEGORY_CONTENT_KEY,
} from "constants/queryKeys"

import { ServicesContext } from "contexts/ServicesContext"

import { useSuccessToast, useErrorToast } from "utils/toasts"

import { DEFAULT_RETRY_MSG } from "utils"

// eslint-disable-next-line import/prefer-default-export
export function useMoveHook(params, queryParams) {
  const { moverService } = useContext(ServicesContext)
  const queryClient = useQueryClient()
  const successToast = useSuccessToast()
  const errorToast = useErrorToast()
  return useMutation((body) => moverService.move(params, body), {
    ...queryParams,
    onError: (err) => {
      if (err.response.status === 409)
        errorToast({
          description: `A file of the same name exists in the folder you are moving to. Please rename your file before moving.`,
        })
      else
        errorToast({
          description: `Your file could not be moved. ${DEFAULT_RETRY_MSG}`,
        })
      if (queryParams && queryParams.onError) queryParams.onError()
    },
    onSuccess: (resp) => {
      console.log(params)
      if (!resp)
        successToast({
          description: `File is already in this folder`,
        })
      else
        successToast({
          description: `Successfully moved file`,
        })
      if (params.mediaRoom || params.collectionName)
        queryClient.invalidateQueries([
          // invalidates collection pages or resource pages
          DIR_CONTENT_KEY,
          { ...params },
        ])
      else if (params.resourceCategoryName) {
        queryClient.invalidateQueries([RESOURCE_CATEGORY_CONTENT_KEY, params])
      } else
        queryClient.invalidateQueries([
          DIR_CONTENT_KEY,
          { ...params, isUnlinked: true },
        ]) // invalidates unlinked pages
      if (queryParams && queryParams.onSuccess) queryParams.onSuccess()
    },
  })
}
