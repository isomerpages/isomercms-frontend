import { useContext } from "react"
import { useMutation, useQueryClient } from "react-query"
import { DEFAULT_RETRY_MSG } from "../../utils"
import { errorToast, successToast } from "../../utils/toasts"
import { SETTINGS_CONTENT_KEY } from "../queryKeys"

import { ServicesContext } from "../../contexts/ServicesContext"

export function useUpdateSettingsHook(params, queryParams) {
  const queryClient = useQueryClient()
  const { settingsService } = useContext(ServicesContext)
  return useMutation((body) => settingsService.update(params, body), {
    ...queryParams,
    onSettled: () => {
      queryClient.invalidateQueries([SETTINGS_CONTENT_KEY, { ...params }])
    },
    onSuccess: () => {
      successToast(`Successfully updated settings!`)
      queryParams && queryParams.onSuccess && queryParams.onSuccess()
    },
    onError: (err) => {
      if (err.response.status !== 409)
        errorToast(`Your page could not be updated. ${DEFAULT_RETRY_MSG}`)
      queryParams && queryParams.onError && queryParams.onError(err)
    },
  })
}
