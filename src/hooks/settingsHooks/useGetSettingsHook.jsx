import { useContext } from "react"
import { useQuery } from "react-query"

import { ServicesContext } from "../../contexts/ServicesContext"
import { DEFAULT_RETRY_MSG } from "../../utils"
import { errorToast } from "../../utils/toasts"
import { SETTINGS_CONTENT_KEY } from "../queryKeys"

export function useGetSettingsHook(params, queryParams) {
  const { settingsService } = useContext(ServicesContext)
  return useQuery(
    [SETTINGS_CONTENT_KEY, { ...params }],
    () => settingsService.get(params),
    {
      ...queryParams,
      retry: false,
      onError: () => {
        errorToast(
          `The settings data could not be retrieved. ${DEFAULT_RETRY_MSG}`
        )
        if (queryParams && queryParams.onError) queryParams.onError()
      },
    }
  )
}
