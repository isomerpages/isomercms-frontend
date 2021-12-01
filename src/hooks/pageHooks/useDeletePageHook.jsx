import { useContext } from "react"
import { useMutation, useQueryClient } from "react-query"

import { ServicesContext } from "contexts/ServicesContext"

import { DIR_CONTENT_KEY } from "hooks/queryKeys"

import { errorToast, successToast } from "utils/toasts"

import { DEFAULT_RETRY_MSG } from "utils"

export function useDeletePageHook(params, queryParams) {
  const queryClient = useQueryClient()
  const { pageService } = useContext(ServicesContext)
  return useMutation((body) => pageService.delete(params, body), {
    ...queryParams,
    onError: () => {
      errorToast(
        `Your file could not be deleted successfully. ${DEFAULT_RETRY_MSG}`
      )
      queryParams && queryParams.onError && queryParams.onError()
    },
    onSuccess: () => {
      successToast(`Successfully deleted file`)
      if (params.collectionName || params.resourceRoomName)
        queryClient.invalidateQueries([
          // invalidates collection pages or resource pages
          DIR_CONTENT_KEY,
          (({ fileName, ...p }) => p)(params),
        ])
      else
        queryClient.invalidateQueries([
          DIR_CONTENT_KEY,
          { siteName: params.siteName, isUnlinked: true },
        ]) // invalidates unlinked pages
      queryParams && queryParams.onSuccess && queryParams.onSuccess()
    },
  })
}
