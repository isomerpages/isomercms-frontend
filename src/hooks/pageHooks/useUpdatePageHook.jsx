import _ from "lodash"
import { useContext } from "react"
import { useMutation, useQueryClient } from "react-query"

import { ServicesContext } from "contexts/ServicesContext"

import { DIR_CONTENT_KEY, PAGE_CONTENT_KEY } from "hooks/queryKeys"

import { errorToast, successToast } from "utils/toasts"

import { DEFAULT_RETRY_MSG } from "utils"

export function useUpdatePageHook(params, queryParams) {
  const queryClient = useQueryClient()
  const { pageService } = useContext(ServicesContext)
  return useMutation((body) => pageService.update(params, body), {
    ...queryParams,
    onSettled: () => {
      queryClient.invalidateQueries([PAGE_CONTENT_KEY, { ...params }])
    },
    onSuccess: () => {
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
      successToast(`Successfully updated page!`)
      if (queryParams && queryParams.onSuccess) queryParams.onSuccess()
    },
    onError: (err) => {
      if (err.response.status !== 409)
        errorToast(`Your page could not be updated. ${DEFAULT_RETRY_MSG}`)
      if (queryParams && queryParams.onError) queryParams.onError(err)
    },
  })
}
