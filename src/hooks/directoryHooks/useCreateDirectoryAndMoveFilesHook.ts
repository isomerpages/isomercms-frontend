import { AxiosError } from "axios"
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from "react-query"

import {
  LIST_MEDIA_DIRECTORY_FILES_KEY,
  GET_ALL_MEDIA_FILES_KEY,
  LIST_MEDIA_FOLDERS_KEY,
} from "constants/queryKeys"

import { moveMultipleMedia } from "hooks/moveHooks"

import { apiService } from "services/ApiService"

import { DirectoryService } from "services"
import { MiddlewareError } from "types/error"
import { MediaDirectoryParams } from "types/folders"
import { MediaFolderCreationInfo } from "types/media"

const createDirectoryAndMoveFiles = async (
  params: MediaDirectoryParams,
  { newDirectoryName, selectedPages }: MediaFolderCreationInfo
) => {
  const directoryService = new DirectoryService({ apiClient: apiService })
  const { siteName, mediaDirectoryName } = params

  const newDirectoryPath = [
    decodeURIComponent(mediaDirectoryName),
    newDirectoryName,
  ].join("/")

  if (selectedPages.length === 0) {
    return directoryService.create(
      { siteName, mediaDirectoryName, isCreate: true },
      { newDirectoryName: newDirectoryPath, items: [] }
    )
  }

  return (
    directoryService
      .create(
        { siteName, mediaDirectoryName, isCreate: true },
        { newDirectoryName: newDirectoryPath, items: [] }
      )
      // This wait is necessary to avoid the repo lock
      .then(() => new Promise((resolve) => setTimeout(resolve, 500)))
      .then(() => {
        moveMultipleMedia(params, {
          target: { directoryName: newDirectoryPath },
          items: selectedPages,
        })
      })
      // This wait is necessary to allow the backend to catch up
      .then(() => new Promise((resolve) => setTimeout(resolve, 500)))
  )
}

export const useCreateDirectoryAndMoveFilesHook = (
  params: MediaDirectoryParams,
  mutationOptions?: Omit<
    UseMutationOptions<
      void,
      AxiosError<MiddlewareError>,
      MediaFolderCreationInfo
    >,
    "mutationFn" | "mutationKey"
  >
): UseMutationResult<
  void,
  AxiosError<MiddlewareError>,
  MediaFolderCreationInfo
> => {
  const queryClient = useQueryClient()

  return useMutation<
    void,
    AxiosError<MiddlewareError>,
    MediaFolderCreationInfo
  >((data) => createDirectoryAndMoveFiles(params, data), {
    ...mutationOptions,
    onSettled: (data, error, variables, context) => {
      queryClient.invalidateQueries([LIST_MEDIA_DIRECTORY_FILES_KEY])
      queryClient.invalidateQueries([GET_ALL_MEDIA_FILES_KEY])
      queryClient.invalidateQueries([LIST_MEDIA_FOLDERS_KEY])
      if (mutationOptions?.onSettled)
        mutationOptions.onSettled(data, error, variables, context)
    },
    onSuccess: (data, variables, context) => {
      if (mutationOptions?.onSuccess)
        mutationOptions.onSuccess(data, variables, context)
    },
    onError: (err, variables, context) => {
      if (mutationOptions?.onError)
        mutationOptions.onError(err, variables, context)
    },
  })
}
