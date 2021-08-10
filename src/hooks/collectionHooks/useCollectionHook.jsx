// used in EditPageV2
// currently uses the v1 collection endpoints, to be refactored after v2 collection endpoints are completed

import axios from "axios"

import { useQuery } from "react-query"
import { errorToast } from "../../utils/toasts"
import { parseDirectoryFile } from "../../utils"
import { DIR_CONTENT_KEY } from "../queryKeys"
import useRedirectHook from "../useRedirectHook"

const getDirectoryFile = async ({ siteName, folderName }) => {
  if (!folderName) return undefined
  const resp = await axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections/${folderName}/pages/collection.yml`
  )
  const { content: dirContent } = resp.data
  const { order: parsedFolderContents } = parseDirectoryFile(dirContent)
  // Filter out placeholder files
  const filteredFolderContents = parsedFolderContents.filter(
    (name) => !name.includes(".keep")
  )
  return filteredFolderContents
}

// get directory data
export function useCollectionHook(params) {
  const { setRedirectToNotFound } = useRedirectHook()
  return useQuery([DIR_CONTENT_KEY, params], () => getDirectoryFile(params), {
    retry: false,
    initialData: [],
    onError: (err) => {
      if (err.response && err.response.status === 404) {
        setRedirectToNotFound(siteName)
      } else {
        errorToast(
          `There was a problem trying to load your page. ${DEFAULT_RETRY_MSG}`
        )
      }
    },
  })
}
