import { AxiosError } from "axios"
import {
  useMutation,
  UseMutationOptions,
  UseMutationResult,
  useQueryClient,
} from "react-query"

import { LIST_MEDIA_DIRECTORY_FILES_KEY } from "constants/queryKeys"

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

  await selectedMediaDto
    .map((deleteMedia) => {
      const pathTokens = deleteMedia.filePath.split("/")

      const reqParams = {
        siteName,
        mediaDirectoryName: pathTokens.slice(0, -1).join("%2F"),
        fileName: pathTokens.pop(),
        sha: deleteMedia.sha,
      }

      return reqParams
    })
    .reduce(
      (acc, curr) =>
        acc
          .then(() => {
            const { sha, ...rest } = curr
            mediaService.delete(rest, { sha }).catch((error) => {
              // We want to continue even if some of the media files fail to delete
              // because there is no turning back now if we fail (the earlier files
              // would have been deleted)
              return error
            }) as Promise<void>
          })
          // This wait is necessary to avoid the repo lock
          .then(() => new Promise((resolve) => setTimeout(resolve, 500))),
      Promise.resolve()
    )
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
