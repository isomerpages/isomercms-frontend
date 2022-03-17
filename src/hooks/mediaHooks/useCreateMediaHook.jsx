import _ from "lodash"
import { useContext } from "react"
import { useMutation, useQueryClient } from "react-query"

import { ServicesContext } from "contexts/ServicesContext"

import { DIR_CONTENT_KEY } from "hooks/queryKeys"

import { successToast, errorToast } from "utils/toasts"

import { DEFAULT_RETRY_MSG } from "utils"

export function useCreateMediaHook(params, queryParams) {
  const queryClient = useQueryClient()
  const { mediaService } = useContext(ServicesContext)
  return useMutation((body) => mediaService.create(params, body), {
    ...queryParams,
    onSuccess: ({ data }) => {
      successToast(`Media file successfully uploaded`)
      const newMedia = {
        ...data,
        mediaUrl: data.content,
        type: "file",
      }
      queryClient.setQueryData(
        [DIR_CONTENT_KEY, _.omit(params, "fileName")],
        (oldMediasData) =>
          oldMediasData ? [newMedia, ...oldMediasData] : [newMedia]
      )
      queryClient.invalidateQueries([
        // invalidates media directory
        DIR_CONTENT_KEY,
        _.omit(params, "fileName"),
      ])
      if (queryParams && queryParams.onSuccess) queryParams.onSuccess()
    },
    onError: () => {
      errorToast(`A new media file could not be created. ${DEFAULT_RETRY_MSG}`)
      if (queryParams && queryParams.onError) queryParams.onError()
    },
  })
}
