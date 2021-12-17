import { useContext } from "react"
import { useMutation, useQueryClient } from "react-query"

import { ServicesContext } from "contexts/ServicesContext"

import { DIR_CONTENT_KEY } from "hooks/queryKeys"

import { errorToast, successToast } from "utils/toasts"

import { DEFAULT_RETRY_MSG } from "utils"

export function useDeleteMediaHook(params, queryParams) {
  const queryClient = useQueryClient()
  const { mediaService } = useContext(ServicesContext)
  return useMutation((body) => mediaService.delete(params, body), {
    ...queryParams,
    onError: () => {
      errorToast(
        `Your media file could not be deleted successfully. ${DEFAULT_RETRY_MSG}`
      )
      queryParams && queryParams.onError && queryParams.onError()
    },
    onSuccess: () => {
      successToast(`Successfully deleted media file`)
      if (params.mediaRoom || params.mediaDirectoryName)
        // delete cached media from directory list
        queryClient.setQueryData(
          [DIR_CONTENT_KEY, (({ fileName, ...p }) => p)(params)],
          (oldMediasData) =>
            oldMediasData.filter((media) => media.name !== params.fileName)
        )
      queryClient.invalidateQueries([
        // invalidates media directory
        DIR_CONTENT_KEY,
        (({ fileName, ...p }) => p)(params),
      ])
      queryParams && queryParams.onSuccess && queryParams.onSuccess()
    },
  })
}
