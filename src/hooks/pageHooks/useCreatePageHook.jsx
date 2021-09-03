import { useContext } from "react"
import { useMutation } from "react-query"
import { getRedirectUrl, DEFAULT_RETRY_MSG } from "../../utils"
import { errorToast } from "../../utils/toasts"
import useRedirectHook from "../useRedirectHook"

import { ServicesContext } from "../../contexts/ServicesContext"

export function useCreatePageHook(params, queryParams) {
  const { pageService } = useContext(ServicesContext)
  const { setRedirectToPage } = useRedirectHook()
  return useMutation((body) => pageService.create(params, body), {
    ...queryParams,
    onSuccess: (resp) => {
      setRedirectToPage(
        getRedirectUrl({ ...params, fileName: resp.data.fileName })
      )
      queryParams && queryParams.onSuccess && queryParams.onSuccess()
    },
    onError: () => {
      errorToast(`A new page could not be created. ${DEFAULT_RETRY_MSG}`)
      queryParams && queryParams.onError && queryParams.onError()
    },
  })
}
