import axios from 'axios';

import { IMAGE_CONTENTS_KEY, DOCUMENT_CONTENTS_KEY } from '../queryKeys'
import { useMutation, useQueryClient } from 'react-query'
import { errorToast, successToast } from '../../utils/toasts'
import { DEFAULT_RETRY_MSG } from '../../utils'
import { generateImageorFilePath } from '../../utils'

const renameMedia = async ({siteName, type, customPath, fileName, newFileName}) => { // to simplify in the future with API client
  if (newFileName === fileName) return
  return await axios.post(`${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/${type === 'images' ? 'images' : 'documents'}/${generateImageorFilePath(customPath, fileName)}/rename/${generateImageorFilePath(customPath, newFileName)}`);
}

export function useUpdateMediaHook(siteName, type, customPath, onSave) {
  const queryClient = useQueryClient()
  return useMutation(
    (params) => renameMedia(params),
    {
      onError: (err) => {
        if (err?.response?.status === 409) {
          // Error due to conflict in name
          errorToast(`Another ${type.slice(0,-1)} with the same name exists. Please choose a different name.`)
        } else if (err?.response?.status === 413 || err?.response === undefined) {
          // Error due to file size too large - we receive 413 if nginx accepts the payload but it is blocked by our express settings, and undefined if it is blocked by nginx
          errorToast(`Unable to upload as the ${type.slice(0,-1)} size exceeds 5MB. Please reduce your ${type.slice(0,-1)} size and try again.`)
        } else {
          errorToast(`There was a problem trying to save this ${type.slice(0,-1)}. ${DEFAULT_RETRY_MSG}`)
        }
        console.log(err);
      },
      onSuccess: () => {
        successToast(`Successfully renamed ${type.slice(0,-1)}!`)
        // queryClient.removeQueries(`${siteName}/images/${(customPath===undefined?'':customPath+'/')}${fileName}`) // to rethink query keys? 
        queryClient.invalidateQueries(type === 'images' ? [IMAGE_CONTENTS_KEY, customPath] : [DOCUMENT_CONTENTS_KEY, customPath])
      },
      onSettled: () => {
        // onSave(newFileName) // fixed on the backend to return newFileName ?
        onSave()
      },
    }
  )
}