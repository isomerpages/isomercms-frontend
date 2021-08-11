import axios from "axios"

import { useQuery } from "react-query"
import { getPageApiEndpointV2 } from "../../api"
import { DEFAULT_RETRY_MSG } from "../../utils"
import { errorToast } from "../../utils/toasts"
import { PAGE_CONTENT_KEY } from "../queryKeys"

const getEditPageData = async ({
  siteName,
  collectionName,
  subCollectionName,
  resourceName,
  fileName,
}) => {
  const apiEndpoint = getPageApiEndpointV2({
    siteName,
    collectionName,
    subCollectionName,
    resourceName,
    fileName,
  })
  const resp = await axios.get(apiEndpoint)
  return resp.data
}

export function usePageHook(params, queryParams) {
  return useQuery(
    [PAGE_CONTENT_KEY, { ...params }],
    () => getEditPageData(params),
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
