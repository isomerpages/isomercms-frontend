import _ from "lodash"
import { useContext } from "react"
import { useMutation, useQueryClient } from "react-query"

import { LIST_MEDIA_DIRECTORY_FILES_KEY } from "constants/queryKeys"

import { ServicesContext } from "contexts/ServicesContext"

import { useSuccessToast, useErrorToast } from "utils/toasts"

import { DEFAULT_RETRY_MSG } from "utils"

export function useDeleteMediaHook(params, queryParams) {
  const queryClient = useQueryClient()
  const { mediaService } = useContext(ServicesContext)
  const successToast = useSuccessToast()
  const errorToast = useErrorToast()
  return useMutation((body) => mediaService.delete(params, body), {
    ...queryParams,
    onError: () => {
      errorToast({
        id: "delete-media-file-error",
        description: `Your media file could not be deleted successfully. ${DEFAULT_RETRY_MSG}`,
      })
      if (queryParams && queryParams.onError) queryParams.onError()
    },
    onSuccess: () => {
      successToast({
        id: "delete-media-file-success",
        description: `Successfully deleted media file!`,
      })
      queryClient.invalidateQueries([
        // invalidates media directory
        LIST_MEDIA_DIRECTORY_FILES_KEY,
        _.omit(params, "fileName"),
      ])
      if (queryParams && queryParams.onSuccess) queryParams.onSuccess()
    },
  })
}
