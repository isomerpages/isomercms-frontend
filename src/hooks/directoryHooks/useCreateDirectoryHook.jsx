import { useContext } from "react"
import { useMutation, useQueryClient } from "react-query"

import { ServicesContext } from "contexts/ServicesContext"

import { DIR_CONTENT_KEY } from "hooks/queryKeys"
import useRedirectHook from "hooks/useRedirectHook"

import { errorToast } from "utils/toasts"

import { getRedirectUrl, DEFAULT_RETRY_MSG } from "utils"

export function useCreateDirectoryHook(params, queryParams) {
  const queryClient = useQueryClient()
  const { directoryService } = useContext(ServicesContext)
  const { setRedirectToPage } = useRedirectHook()
  return useMutation(
    (body) => directoryService.create({ ...params, isCreate: true }, body),
    {
      ...queryParams,
      retry: false,
      onError: () => {
        errorToast(`A new directory could not be created. ${DEFAULT_RETRY_MSG}`)
        queryParams && queryParams.onError && queryParams.onError()
      },
      onSuccess: (resp) => {
        queryClient.invalidateQueries([DIR_CONTENT_KEY, { ...params }])
        setRedirectToPage(
          getRedirectUrl({
            collectionName: resp.data.newDirectoryName,
            subCollectionName:
              params.collectionName && resp.data.newDirectoryName,
            ...params,
          })
        )
        queryParams && queryParams.onSuccess && queryParams.onSuccess()
      },
    }
  )
}
