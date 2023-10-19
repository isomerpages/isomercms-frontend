import _ from "lodash"
import { useContext } from "react"
import { useMutation, useQueryClient } from "react-query"

import {
  MEDIA_CONTENT_KEY,
  LIST_MEDIA_DIRECTORY_FILES_KEY,
} from "constants/queryKeys"

import { ServicesContext } from "contexts/ServicesContext"

import { useSuccessToast, useErrorToast } from "utils/toasts"

import { DEFAULT_RETRY_MSG } from "utils"

import { extractMediaInfo } from "./utils"
// eslint-disable-next-line import/prefer-default-export
export function useUpdateMediaHook(params, queryParams) {
  const queryClient = useQueryClient()
  const { mediaService } = useContext(ServicesContext)
  const successToast = useSuccessToast()
  const errorToast = useErrorToast()
  return useMutation(
    (body) => {
      const { newFileName, sha } = extractMediaInfo(body)
      return mediaService.update(params, { newFileName, sha })
    },
    {
      ...queryParams,
      onSettled: () => {
        queryClient.invalidateQueries([MEDIA_CONTENT_KEY, { ...params }])
      },
      onSuccess: async () => {
        await new Promise((resolve) => setTimeout(resolve, 500))
        successToast({
          id: "update-media-file-success",
          description: `Successfully updated media file!`,
        })
        queryClient.invalidateQueries([
          LIST_MEDIA_DIRECTORY_FILES_KEY,
          _.omit(params, "fileName"),
        ])
        if (queryParams && queryParams.onSuccess) queryParams.onSuccess()
      },
      onError: (err) => {
        if (err.response.status !== 409)
          errorToast({
            id: "update-media-file-error",
            description: `Your media file could not be updated. ${DEFAULT_RETRY_MSG}`,
          })
        if (queryParams && queryParams.onError) queryParams.onError(err)
      },
    }
  )
}
