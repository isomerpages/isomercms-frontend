import _ from "lodash"
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
export function useDeletePageHook(params, queryParams) {
  const queryClient = useQueryClient()
  const { pageService } = useContext(ServicesContext)
  const successToast = useSuccessToast()
  const errorToast = useErrorToast()
  return useMutation((body) => pageService.delete(params, body), {
    ...queryParams,
    onError: () => {
      errorToast({
        id: "delete-page-error",
        description: `Your page could not be deleted successfully. ${DEFAULT_RETRY_MSG}`,
      })
      if (queryParams && queryParams.onError) queryParams.onError()
    },
    onSuccess: () => {
      successToast({
        id: "delete-page-success",
        description: `Successfully deleted page!`,
      })
      if (params.collectionName)
        queryClient.invalidateQueries([
          // invalidates collection pages or resource pages
          DIR_CONTENT_KEY,
          _.omit(params, "fileName"),
        ])
      else if (params.resourceRoomName) {
        queryClient.invalidateQueries([
          RESOURCE_CATEGORY_CONTENT_KEY,
          _.omit(params, "fileName"),
        ])
      } else
        queryClient.invalidateQueries([
          DIR_CONTENT_KEY,
          { siteName: params.siteName, isUnlinked: true },
        ]) // invalidates unlinked pages
      if (queryParams && queryParams.onSuccess) queryParams.onSuccess()
    },
  })
}
