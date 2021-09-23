import { useContext } from "react"
import { useMutation, useQueryClient } from "react-query"
import { DEFAULT_RETRY_MSG } from "../../utils"
import { errorToast, successToast } from "../../utils/toasts"
import {
  DIR_CONTENT_KEY,
  PAGE_CONTENT_KEY,
  PAGE_SETTINGS_KEY,
} from "../queryKeys"

import { ServicesContext } from "../../contexts/ServicesContext"

export function useUpdatePageHook(params, queryParams) {
  const queryClient = useQueryClient()
  const { pageService } = useContext(ServicesContext)
  return useMutation((body) => pageService.update(params, body), {
    ...queryParams,
    onSettled: () => {
      queryClient.invalidateQueries([PAGE_CONTENT_KEY, { ...params }])
      queryClient.invalidateQueries([PAGE_SETTINGS_KEY, { ...params }])
    },
    onSuccess: () => {
      if (params.collectionName)
        queryClient.invalidateQueries([
          // invalidates collection
          DIR_CONTENT_KEY,
          (({ fileName, ...p }) => p)(params),
        ])
      // else queryClient.invalidateQueries([PAGE_CONTENT_KEY, { siteName }]) // invalidates unlinked pages
      successToast(`Successfully updated page!`)
      queryParams && queryParams.onSuccess && queryParams.onSuccess()
    },
    onError: (err) => {
      if (err.response.status !== 409)
        errorToast(`Your page could not be updated. ${DEFAULT_RETRY_MSG}`)
      queryParams && queryParams.onError && queryParams.onError(err)
    },
  })
}
