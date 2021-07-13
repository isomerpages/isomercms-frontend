import axios from "axios"

import { useMutation, useQueryClient } from "react-query"
import { getPageApiEndpointV2 } from "../../api"
import { DEFAULT_RETRY_MSG } from "../../utils"
import { errorToast, successToast } from "../../utils/toasts"
import { DIR_CONTENT_KEY } from "../queryKeys"

const deletePageData = async (
  { siteName, collectionName, subCollectionName, resourceName, fileName },
  { sha }
) => {
  const apiEndpoint = getPageApiEndpointV2({
    siteName,
    collectionName,
    subCollectionName,
    resourceName,
    fileName,
  })
  const body = { sha }
  return axios.delete(apiEndpoint, body)
}

export function useDeletePageHook(params, queryParams) {
  const queryClient = new useQueryClient()
  return useMutation((body) => deletePageData(params, body), {
    ...queryParams,
    onError: () =>
      errorToast(
        `Your file could not be deleted successfully. ${DEFAULT_RETRY_MSG}`
      ),
    onSuccess: () => {
      successToast(`Successfully deleted file`)
      if (params.collectionName)
        queryClient.invalidateQueries([
          // invalidates collection
          DIR_CONTENT_KEY,
          (({ fileName, ...p }) => p)(params),
        ])
      else queryClient.invalidateQueries([PAGE_CONTENT_KEY, { siteName }]) // invalidates unlinked pages
    },
  })
}
