import { useContext } from "react"
import { useQuery } from "react-query"
import { DEFAULT_RETRY_MSG } from "../../utils"
import { errorToast } from "../../utils/toasts"
import { CONFIG_CONTENT_KEY } from "../queryKeys"

import { ServicesContext } from "../../contexts/ServicesContext"

export function useGetConfigHook(params, queryParams) {
  const { configService } = useContext(ServicesContext)
  return useQuery(
    [CONFIG_CONTENT_KEY, params],
    () => configService.get(params),
    {
      ...queryParams,
      retry: false,
      onError: () => {
        errorToast(
          `The configurations could not be retrieved. ${DEFAULT_RETRY_MSG}`
        )
        queryParams && queryParams.onError && queryParams.onError()
      },
    }
  )
}
