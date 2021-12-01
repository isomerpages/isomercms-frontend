import { useContext } from "react"
import { useQuery } from "react-query"

import { ServicesContext } from "contexts/ServicesContext"

import { DIR_CONTENT_KEY } from "hooks/queryKeys"
import useRedirectHook from "hooks/useRedirectHook"

import { errorToast } from "utils/toasts"

import { DEFAULT_RETRY_MSG } from "utils"

// get directory data
export function useGetDirectoryHook(params, queryParams) {
  const { directoryService } = useContext(ServicesContext)
  const { setRedirectToNotFound } = useRedirectHook()
  return useQuery(
    [DIR_CONTENT_KEY, { ...params }],
    () => directoryService.get(params),
    {
      ...queryParams,
      retry: false,
      onError: (err) => {
        console.log(err)
        if (err.response && err.response.status === 404) {
          setRedirectToNotFound()
        } else {
          errorToast(
            `There was a problem retrieving directory contents. ${DEFAULT_RETRY_MSG}`
          )
        }
        queryParams && queryParams.onError && queryParams.onError()
      },
    }
  )
}
