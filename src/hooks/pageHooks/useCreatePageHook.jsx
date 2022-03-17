import _ from "lodash"
import { useContext } from "react"
import { useMutation, useQueryClient } from "react-query"

import { ServicesContext } from "contexts/ServicesContext"

import { DIR_CONTENT_KEY } from "hooks/queryKeys"
import useRedirectHook from "hooks/useRedirectHook"

import { errorToast } from "utils/toasts"

import { getRedirectUrl, DEFAULT_RETRY_MSG } from "utils"

// eslint-disable-next-line import/prefer-default-export
export function useCreatePageHook(params, queryParams) {
  const queryClient = useQueryClient()
  const { pageService } = useContext(ServicesContext)
  const { setRedirectToPage } = useRedirectHook()
  return useMutation((body) => pageService.create(params, body), {
    ...queryParams,
    onSuccess: (resp) => {
      if (params.collectionName || params.resourceRoomName)
        queryClient.invalidateQueries([
          // invalidates collection pages or resource pages
          DIR_CONTENT_KEY,
          _.omit(params, "fileName"),
        ])
      else
        queryClient.invalidateQueries([
          DIR_CONTENT_KEY,
          { siteName: params.siteName, isUnlinked: true },
        ]) // invalidates unlinked pages
      setRedirectToPage(
        getRedirectUrl({ ...params, fileName: resp.data.fileName })
      )
      if (queryParams && queryParams.onSuccess) queryParams.onSuccess()
    },
    onError: () => {
      errorToast(`A new page could not be created. ${DEFAULT_RETRY_MSG}`)
      if (queryParams && queryParams.onError) queryParams.onError()
    },
  })
}
