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
import { DEFAULT_RETRY_MSG, useErrorToast, useSuccessToast } from "utils"

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
      }

      return mediaService
        .delete(reqParams, { sha: deleteMedia.sha })
        .catch((error) => {
          // We want to continue even if some of the media files fail to delete
          // because there is no turning back now if we fail (the earlier files
          // would have been deleted)
          return error
        }) as Promise<void>
    })
    .reduce((acc, curr) => acc.then(async () => curr), Promise.resolve())
}

export const useDeleteMultipleMediaHook = (
  params: MediaDirectoryParams,
  mutationOptions?: Omit<
    UseMutationOptions<void, AxiosError<MiddlewareError>, SelectedMediaDto[]>,
    "mutationFn" | "mutationKey"
  >
): UseMutationResult<void, AxiosError<MiddlewareError>, SelectedMediaDto[]> => {
  const queryClient = useQueryClient()
  const successToast = useSuccessToast()
  const errorToast = useErrorToast()

  return useMutation(
    (selectedMediaDto: SelectedMediaDto[]) =>
      deleteMultipleMedia(params, selectedMediaDto),
    {
      ...mutationOptions,
      onSettled: () => {
        queryClient.invalidateQueries([LIST_MEDIA_DIRECTORY_FILES_KEY, params])
      },
      onSuccess: (data, variables, context) => {
        successToast({
          id: "delete-multiple-media-success",
          description: "Successfully deleted media file(s)!",
        })
        if (mutationOptions?.onSuccess)
          mutationOptions.onSuccess(data, variables, context)
      },
      onError: (err, variables, context) => {
        errorToast({
          id: "delete-multiple-media-error",
          description: `Your media file(s) could not be deleted successfully. ${DEFAULT_RETRY_MSG}`,
        })
        if (mutationOptions?.onError)
          mutationOptions.onError(err, variables, context)
      },
    }
  )
}
