import { useContext } from "react"
import { useMutation, useQueryClient } from "react-query"
import { DEFAULT_RETRY_MSG } from "../../utils"
import { errorToast, successToast } from "../../utils/toasts"
import { CONFIG_CONTENT_KEY } from "../queryKeys"

import { ServicesContext } from "../../contexts/ServicesContext"

export function useUpdateConfigHook(params, queryParams) {
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
