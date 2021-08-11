import axios from "axios"

import { useMutation, useQueryClient } from "react-query"
import { getPageApiEndpointV2 } from "../../api"
import { DEFAULT_RETRY_MSG } from "../../utils"
import { errorToast, successToast } from "../../utils/toasts"
import {
  DIR_CONTENT_KEY,
  PAGE_CONTENT_KEY,
  PAGE_SETTINGS_KEY,
} from "../queryKeys"

const updatePageData = async (
  { siteName, collectionName, subCollectionName, resourceName, fileName },
  { newFileName, frontMatter, pageBody, sha }
) => {
  const apiEndpoint = getPageApiEndpointV2({
    siteName,
    collectionName,
    subCollectionName,
    resourceName,
    fileName,
  })
  const body = {
    content: {
      pageBody,
      frontMatter,
    },
    newFileName,
    sha,
  }
  return await axios.post(apiEndpoint, body)
}

export function useUpdatePageHook(params, queryParams) {
  const queryClient = new useQueryClient()
  return useMutation((body) => updatePageData(params, body), {
    ...queryParams,
    onSuccess: () => {
      queryClient.invalidateQueries([PAGE_CONTENT_KEY, { ...params }])
      queryClient.invalidateQueries([PAGE_SETTINGS_KEY, { ...params }])
      if (params.collectionName)
        queryClient.invalidateQueries([
          // invalidates collection
          DIR_CONTENT_KEY,
          (({ fileName, ...p }) => p)(params),
        ])
      // else queryClient.invalidateQueries([PAGE_CONTENT_KEY, { siteName }]) // invalidates unlinked pages
      successToast(`Successfully updated page!`)
    },
    onError: () =>
      errorToast(`Your page could not be updated. ${DEFAULT_RETRY_MSG}`),
  })
}
