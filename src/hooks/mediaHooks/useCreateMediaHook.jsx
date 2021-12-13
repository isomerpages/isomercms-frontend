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
      }
      queryClient.setQueryData(
        [DIR_CONTENT_KEY, (({ fileName, ...p }) => p)(params)],
        (oldMediasData) => [newMedia, ...oldMediasData]
      )
      queryParams && queryParams.onSuccess && queryParams.onSuccess()
    },
    onError: () => {
      errorToast(`A new media file could not be created. ${DEFAULT_RETRY_MSG}`)
      queryParams && queryParams.onError && queryParams.onError()
    },
  })
}
