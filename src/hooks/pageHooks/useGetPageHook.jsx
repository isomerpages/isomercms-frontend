import { useContext } from "react"
import { useQuery } from "react-query"
import { DEFAULT_RETRY_MSG } from "../../utils"
import { errorToast } from "../../utils/toasts"
import { PAGE_CONTENT_KEY } from "../queryKeys"

import { ServicesContext } from "../../contexts/ServicesContext"

export function useGetPageHook(params, queryParams) {
  const { pageService } = useContext(ServicesContext)
  return useQuery(
    [PAGE_CONTENT_KEY, { ...params }],
    () => pageService.get(params),
    {
      ...queryParams,
      retry: false,
      onError: () => {
        errorToast(`The page data could not be retrieved. ${DEFAULT_RETRY_MSG}`)
        queryParams && queryParams.onError && queryParams.onError()
      },
    }
  )
}
