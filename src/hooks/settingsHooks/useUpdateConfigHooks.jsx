import { useContext } from "react"
import { useMutation, useQueryClient } from "react-query"

import { ServicesContext } from "../../contexts/ServicesContext"
import { DEFAULT_RETRY_MSG } from "../../utils"
import { errorToast, successToast } from "../../utils/toasts"
import { CONFIG_CONTENT_KEY } from "../queryKeys"

export function useUpdateSettingsHook(params, queryParams) {
  return useUpdateConfigHook(
    { ...params, configEndpoint: "settings" },
    queryParams
  )
}

export function useUpdateHomepageHook(params, queryParams) {
  return useUpdateConfigHook(
    { ...params, configEndpoint: "homepage" },
    queryParams
  )
}

export function useUpdateNavBarHook(params, queryParams) {
  return useUpdateConfigHook(
    { ...params, configEndpoint: "navbar" },
    queryParams
  )
}

function useUpdateConfigHook(params, queryParams) {
  const queryClient = useQueryClient()
  const { configService } = useContext(ServicesContext)
  return useMutation((body) => configService.update(params, body), {
    ...queryParams,
    onSettled: () => {
      queryClient.invalidateQueries([CONFIG_CONTENT_KEY, params])
    },
    onSuccess: () => {
      successToast(`Successfully updated configurations!`)
      queryParams && queryParams.onSuccess && queryParams.onSuccess()
    },
    onError: (err) => {
      if (err.response.status !== 409)
        errorToast(
          `Your configurations could not be updated. ${DEFAULT_RETRY_MSG}`
        )
      queryParams && queryParams.onError && queryParams.onError(err)
    },
  })
}
