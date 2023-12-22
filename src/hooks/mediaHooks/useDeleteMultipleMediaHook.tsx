import { AxiosError } from "axios"
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from "react-query"

import {
  GET_ALL_MEDIA_FILES_KEY,
  LIST_MEDIA_DIRECTORY_FILES_KEY,
} from "constants/queryKeys"

import { apiService } from "services/ApiService"

import { MediaService } from "services"
import { MiddlewareError } from "types/error"
import { MediaDirectoryParams } from "types/folders"
import { SelectedMediaDto } from "types/media"

const deleteMultipleMedia = async (
  { siteName }: MediaDirectoryParams,
  selectedMediaDto: SelectedMediaDto[]
) => {
  const mediaService = new MediaService({ apiClient: apiService })

  await mediaService
    .deleteMultiple(
      { siteName },
      {
        items: selectedMediaDto.map(({ filePath, sha }) => {
          return {
            filePath,
            sha,
          }
        }),
      }
    )
    // Note: Unfortunately, we have to wait for GitHub to finish deleting the files
    // before we can refetch the list of files in the directory. Otherwise, the
    // refetch will return the files that were just deleted.
    .then(() => new Promise((resolve) => setTimeout(resolve, 1000)))
}

export const useDeleteMultipleMediaHook = (
  params: MediaDirectoryParams,
  mutationOptions?: Omit<
    UseMutationOptions<void, AxiosError<MiddlewareError>, SelectedMediaDto[]>,
    "mutationFn" | "mutationKey"
  >
): UseMutationResult<void, AxiosError<MiddlewareError>, SelectedMediaDto[]> => {
  const queryClient = useQueryClient()

  return useMutation(
    (selectedMediaDto: SelectedMediaDto[]) =>
      deleteMultipleMedia(params, selectedMediaDto),
    {
      ...mutationOptions,
      onSettled: (data, error, variables, context) => {
        queryClient.invalidateQueries([LIST_MEDIA_DIRECTORY_FILES_KEY])
        // Note: We choose to remove here because once the files are deleted,
        // refetching will definitely cause a 404 Not Found error, which is what
        // we want to avoid
        variables.forEach(({ filePath }) => {
          const directoryName = encodeURIComponent(
            filePath.split("/").slice(0, -1).join("/")
          )
          const fileName = encodeURIComponent(filePath.split("/").pop() || "")
          queryClient.removeQueries([
            GET_ALL_MEDIA_FILES_KEY,
            { siteName: params.siteName, directoryName, name: fileName },
          ])
        })
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
    }
  )
}
