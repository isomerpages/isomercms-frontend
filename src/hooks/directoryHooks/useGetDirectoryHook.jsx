import _ from "lodash"
import { useContext } from "react"
import { useQuery, useQueryClient } from "react-query"

import { DIR_CONTENT_KEY, MEDIA_CONTENT_KEY } from "constants/queryKeys"

import { ServicesContext } from "contexts/ServicesContext"

import useRedirectHook from "hooks/useRedirectHook"

import { useErrorToast } from "utils/toasts"

import { DEFAULT_RETRY_MSG } from "utils"

/**
 * @deprecated Use the newer hooks that are more focused instead of this hook
 * @param {Object} params the route params
 * @param {Object} queryParams the query params for the underlying useQuery hook
 * @returns
 */
// eslint-disable-next-line import/prefer-default-export
export function useGetDirectoryHook(params, queryParams) {
  const queryClient = useQueryClient()
  const { directoryService } = useContext(ServicesContext)
  const { setRedirectToNotFound } = useRedirectHook()
  const errorToast = useErrorToast()
  return useQuery(
    [DIR_CONTENT_KEY, _.omit(params, "fileName")],
    () => directoryService.get(params),
    {
      ...queryParams,
      retry: false,
      onError: (err) => {
        console.log(err)
        if (err.response && err.response.status === 404) {
          setRedirectToNotFound()
        } else {
          errorToast({
            id: "get-directory-error",
            description: `There was a problem retrieving directory contents. ${DEFAULT_RETRY_MSG}`,
          })
        }
        if (queryParams && queryParams.onError) queryParams.onError(err)
      },
      onSuccess: (data) => {
        if (params.mediaRoom)
          // set queryCache for individual media files because media is bandwidth intensive
          data
            .filter(({ type }) => type === "file")
            .forEach((mediaData) => {
              queryClient.setQueryData(
                [
                  MEDIA_CONTENT_KEY,
                  { ...params, fileName: encodeURIComponent(mediaData.name) },
                ],
                mediaData
              )
            })
        if (queryParams && queryParams.onSuccess) queryParams.onSuccess(data)
      },
    }
  )
}
