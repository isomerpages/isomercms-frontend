import axios from "axios"

import { useMutation } from "react-query"
import { getCreatePageApiEndpointV2 } from "../../utils/apiEndpoints"
import { getRedirectUrl, DEFAULT_RETRY_MSG } from "../../utils"
import { errorToast } from "../../utils/toasts"
import useRedirectHook from "../useRedirectHook"

const createPageData = async (
  { siteName, collectionName, subCollectionName, resourceCategoryName },
  { newFileName, frontMatter }
) => {
  const apiEndpoint = getCreatePageApiEndpointV2({
    siteName,
    collectionName,
    subCollectionName,
    resourceCategoryName,
  })
  const body = {
    content: {
      frontMatter,
    },
    newFileName,
  }
  return await axios.post(apiEndpoint, body)
}

export function useCreatePageHook(params, queryParams) {
  const { setRedirectToPage } = useRedirectHook()
  return useMutation((body) => createPageData(params, body), {
    ...queryParams,
    onSuccess: (resp) => {
      setRedirectToPage(getRedirectUrl(params, resp.data.fileName))
      queryParams && queryParams.onSuccess && queryParams.onSuccess()
    },
    onError: () => {
      errorToast(`A new page could not be created. ${DEFAULT_RETRY_MSG}`)
      queryParams && queryParams.onError && queryParams.onError()
    },
  })
}
