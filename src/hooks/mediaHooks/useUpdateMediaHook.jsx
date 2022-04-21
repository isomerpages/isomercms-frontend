import _ from "lodash"
import { useContext } from "react"
import { useMutation, useQueryClient } from "react-query"

import { ServicesContext } from "contexts/ServicesContext"

import { DIR_CONTENT_KEY, MEDIA_CONTENT_KEY } from "hooks/queryKeys"

import { errorToast, successToast } from "utils/toasts"

import { DEFAULT_RETRY_MSG } from "utils"

import { retrieveMediaInfo } from "./utils"

// eslint-disable-next-line import/prefer-default-export
export function useUpdateMediaHook(params, queryParams) {
  const queryClient = useQueryClient()
  const { mediaService } = useContext(ServicesContext)
  return useMutation(
    (body) => {
      const { newFileName, sha } = retrieveMediaInfo(body)
      return mediaService.update(params, { newFileName, sha })
    },
    {
      ...queryParams,
      onSettled: () => {
        queryClient.invalidateQueries([MEDIA_CONTENT_KEY, { ...params }])
      },
      onSuccess: ({ data }) => {
        successToast(`Successfully updated media file!`)
        if (params.mediaRoom || params.mediaDirectoryName)
          // update cached media in directory list
          queryClient.setQueryData(
            [DIR_CONTENT_KEY, _.omit(params, "fileName")],
            (oldMediasData) => {
              const oldMediaIndex = oldMediasData.findIndex(
                (media) => media.name === params.fileName
              )
              const newMedia = {
                ...oldMediasData[oldMediaIndex],
                name: data.name,
              }
              // eslint-disable-next-line no-param-reassign
              oldMediasData[oldMediaIndex] = newMedia
              return oldMediasData
            }
          )
        queryClient.invalidateQueries([
          // invalidates media directory
          DIR_CONTENT_KEY,
          _.omit(params, "fileName"),
        ])
        if (queryParams && queryParams.onSuccess) queryParams.onSuccess()
      },
      onError: (err) => {
        if (err.response.status !== 409)
          errorToast(
            `Your media file could not be updated. ${DEFAULT_RETRY_MSG}`
          )
        if (queryParams && queryParams.onError) queryParams.onError(err)
      },
    }
  )
}
