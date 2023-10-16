import _ from "lodash"
import { useContext } from "react"
import { useMutation, useQueryClient } from "react-query"

import { LIST_MEDIA_DIRECTORY_FILES_KEY } from "constants/queryKeys"

import { ServicesContext } from "contexts/ServicesContext"

import { useSuccessToast, useErrorToast } from "utils/toasts"

import { DEFAULT_RETRY_MSG } from "utils"

import { extractMediaInfo } from "./utils"

export function useCreateMediaHook(params, queryParams) {
  const queryClient = useQueryClient()
  const { mediaService } = useContext(ServicesContext)
  const successToast = useSuccessToast()
  const errorToast = useErrorToast()
  return useMutation(
    (body) => {
      const { newFileName, content } = extractMediaInfo(body)
      return mediaService.create(params, { newFileName, content })
    },
    {
      ...queryParams,
      onSuccess: () => {
        successToast({
          id: "upload-media-file-success",
          description: `Media file successfully uploaded!`,
        })

        queryClient.invalidateQueries([
          // invalidates media directory
          LIST_MEDIA_DIRECTORY_FILES_KEY,
          _.omit(params, "fileName"),
        ])
        if (queryParams && queryParams.onSuccess) queryParams.onSuccess()
      },
      onError: () => {
        errorToast({
          id: "create-media-file-error",
          description: `A new media file could not be created. ${DEFAULT_RETRY_MSG}`,
        })
        if (queryParams && queryParams.onError) queryParams.onError()
      },
    }
  )
}
