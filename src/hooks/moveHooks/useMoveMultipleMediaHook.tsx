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
  LIST_MEDIA_FOLDERS_KEY,
} from "constants/queryKeys"

import { apiService } from "services/ApiService"

import { MoverService } from "services"
import { MiddlewareError } from "types/error"
import { MediaDirectoryParams } from "types/folders"
import { MoveMultipleMediaDto, MoveSelectedMediaDto } from "types/media"

const moveMultipleMedia = async (
  { siteName }: MediaDirectoryParams,
  { target, items }: MoveSelectedMediaDto
) => {
  const moveService = new MoverService({ apiClient: apiService })

  await items
    .map((item) => {
      const pathTokens = item.filePath.split("/")

      return {
        source: pathTokens.slice(0, -1).join("%2F"),
        target,
        name: pathTokens.pop() || "",
      }
    })
    .reduce<MoveMultipleMediaDto[]>((acc, curr) => {
      // Combine all files with the same source directory into one object
      const existing = acc.find((item) => item.source === curr.source)
      if (existing) {
        existing.items.push({ name: curr.name, type: "file" })
      } else {
        acc.push({
          source: curr.source,
          target: curr.target,
          items: [{ name: curr.name, type: "file" }],
        })
      }
      return acc
    }, [])
    .reduce(
      (acc, curr) =>
        acc
          .then(() => {
            const params = {
              siteName,
              mediaDirectoryName: curr.source,
            }
            const body = {
              target: curr.target,
              items: curr.items,
            }
            return moveService.move(params, body).catch((error) => {
              // We want to continue even if some of the media files fail to
              // move because there is no turning back now if we fail (the
              // earlier files would have been moved)
              return error
            }) as Promise<void>
          })
          .then(() => new Promise((resolve) => setTimeout(resolve, 500))),
      Promise.resolve()
    )
}

export const useMoveMultipleMediaHook = (
  params: MediaDirectoryParams,
  mutationOptions?: Omit<
    UseMutationOptions<void, AxiosError<MiddlewareError>, MoveSelectedMediaDto>,
    "mutationFn" | "mutationKey"
  >
): UseMutationResult<
  void,
  AxiosError<MiddlewareError>,
  MoveSelectedMediaDto
> => {
  const queryClient = useQueryClient()

  return useMutation<void, AxiosError<MiddlewareError>, MoveSelectedMediaDto>(
    (moveSelectedMediaDto) => moveMultipleMedia(params, moveSelectedMediaDto),
    {
      ...mutationOptions,
      onSettled: (data, error, variables, context) => {
        queryClient.invalidateQueries([LIST_MEDIA_DIRECTORY_FILES_KEY])
        queryClient.invalidateQueries([GET_ALL_MEDIA_FILES_KEY])
        queryClient.invalidateQueries([LIST_MEDIA_FOLDERS_KEY])

        if (mutationOptions && mutationOptions.onSettled)
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
