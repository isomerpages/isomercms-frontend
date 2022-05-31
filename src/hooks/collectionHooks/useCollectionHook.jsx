// used in EditPageV2
// currently uses the v1 collection endpoints, to be refactored after v2 collection endpoints are completed

import axios from "axios"
import { useQuery } from "react-query"

import { DIR_CONTENT_KEY } from "hooks/queryKeys"
import useRedirectHook from "hooks/useRedirectHook"

import { useErrorToast } from "utils/toasts"

import { parseDirectoryFile, DEFAULT_RETRY_MSG } from "utils"

const getDirectoryFile = async ({ siteName, collectionName }) => {
  if (!collectionName) return undefined
  const resp = await axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/collections/${collectionName}/pages/collection.yml`
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
// eslint-disable-next-line import/prefer-default-export
export function useCollectionHook(params) {
  const { setRedirectToNotFound } = useRedirectHook()
  const errorToast = useErrorToast()
  return useQuery([DIR_CONTENT_KEY, params], () => getDirectoryFile(params), {
    retry: false,
    initialData: [],
    onError: (err) => {
      if (err.response && err.response.status === 404) {
        setRedirectToNotFound(params.siteName)
      } else {
        errorToast({
          description: `There was a problem trying to load your page. ${DEFAULT_RETRY_MSG}`,
        })
      }
    },
  })
}
