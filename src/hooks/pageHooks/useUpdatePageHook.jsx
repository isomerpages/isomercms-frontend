import _ from "lodash"
import { useContext } from "react"
import { useMutation, useQueryClient } from "react-query"

import {
  DIR_CONTENT_KEY,
  PAGE_CONTENT_KEY,
  RESOURCE_CATEGORY_CONTENT_KEY,
} from "constants/queryKeys"

import { ServicesContext } from "contexts/ServicesContext"

import { getAxiosErrorMessage } from "utils/axios"
import { useSuccessToast, useErrorToast } from "utils/toasts"

import { extractPageInfo } from "./utils"

export function useUpdatePageHook(params, queryParams) {
  const queryClient = useQueryClient()
  const { pageService } = useContext(ServicesContext)
  const successToast = useSuccessToast()
  const errorToast = useErrorToast()
  const { siteName, fileName } = params

  return useMutation(
    (body) => {
      const { newFileName, sha, frontMatter, pageBody } = extractPageInfo(body)

      return pageService.update(params, {
        newFileName,
        sha,
        frontMatter,
        pageBody,
      })
    },
    {
      ...queryParams,
      onSettled: () => {
        queryClient.invalidateQueries([PAGE_CONTENT_KEY, siteName, fileName])
      },
      onSuccess: () => {
        if (params.collectionName)
          queryClient.invalidateQueries([
            // invalidates collection pages or resource pages
            DIR_CONTENT_KEY,
            _.omit(params, "fileName"),
          ])
        else if (params.resourceRoomName) {
          queryClient.invalidateQueries([
            RESOURCE_CATEGORY_CONTENT_KEY,
            _.omit(params, "fileName"),
          ])
        } else
          queryClient.invalidateQueries([
            DIR_CONTENT_KEY,
            { siteName: params.siteName, isUnlinked: true },
          ]) // invalidates unlinked pages
        successToast({
          id: "update-resource-room-name-success",
          description: `Changes saved. See a preview on Staging, or request a Review for them to be published.`,
        })
        if (queryParams && queryParams.onSuccess) queryParams.onSuccess()
      },
      onError: (err) => {
        if (err.response.status !== 409) {
          errorToast({
            id: "update-page-error",
            description: `Your page could not be updated. ${getAxiosErrorMessage(
              err
            )}`,
          })
        }
        if (queryParams && queryParams.onError) queryParams.onError(err)
      },
    }
  )
}
