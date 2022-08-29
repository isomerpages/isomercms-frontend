import _ from "lodash"
import { useContext } from "react"
import { useMutation, useQueryClient } from "react-query"

import {
  DIR_CONTENT_KEY,
  RESOURCE_CATEGORY_CONTENT_KEY,
} from "constants/queryKeys"

import { ServicesContext } from "contexts/ServicesContext"

import useRedirectHook from "hooks/useRedirectHook"

import { useErrorToast } from "utils/toasts"

import { getRedirectUrl, DEFAULT_RETRY_MSG } from "utils"

import { extractPageInfo } from "./utils"

// eslint-disable-next-line import/prefer-default-export
export function useCreatePageHook(params, queryParams) {
  const queryClient = useQueryClient()
  const { pageService } = useContext(ServicesContext)
  const { setRedirectToPage } = useRedirectHook()
  const errorToast = useErrorToast()
  return useMutation(
    (body) => {
      const { newFileName, frontMatter } = extractPageInfo(body)
      return pageService.create(params, { newFileName, frontMatter })
    },
    {
      ...queryParams,
      onSuccess: (resp) => {
        if (params.collectionName)
          queryClient.invalidateQueries([
            // invalidates collection pages or resource pages
            DIR_CONTENT_KEY,
            _.omit(params, "fileName"),
          ])
        else if (params.resourceCategoryName) {
          queryClient.invalidateQueries([
            // invalidates collection pages or resource pages
            RESOURCE_CATEGORY_CONTENT_KEY,
            _.omit(params, "fileName"),
          ])
        } else
          queryClient.invalidateQueries([
            DIR_CONTENT_KEY,
            { siteName: params.siteName, isUnlinked: true },
          ]) // invalidates unlinked pages
        setRedirectToPage(
          getRedirectUrl({ ...params, fileName: resp.data.fileName })
        )
        if (queryParams && queryParams.onSuccess) queryParams.onSuccess()
      },
      onError: () => {
        errorToast({
          description: `A new page could not be created. ${DEFAULT_RETRY_MSG}`,
        })
        if (queryParams && queryParams.onError) queryParams.onError()
      },
    }
  )
}
