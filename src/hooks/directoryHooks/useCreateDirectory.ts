import { AxiosError } from "axios"
import { useMutation, UseMutationResult, useQueryClient } from "react-query"

import { DIR_CONTENT_KEY, RESOURCE_ROOM_NAME_KEY } from "hooks/queryKeys"

import * as DirectoryService from "services/DirectoryService/index"

import { DirectoryInfoProps } from "types/directory"

import { extractCreateDirectoryInfo } from "./utils"

// NOTE: Assuming a void return here
// This is because the return type isn't used by empty resource room
// and will trigger a refetch due to query key invalidation
// NOTE: This is also used in directory creation screen with different params
export const useCreateDirectory = (
  siteName: string
): UseMutationResult<void, AxiosError, DirectoryInfoProps> => {
  const queryClient = useQueryClient()
  return useMutation(
    (body) => {
      const createDirectoryInfo = extractCreateDirectoryInfo(body)
      return DirectoryService.createResourceRoom(siteName, createDirectoryInfo)
    },
    {
      retry: false,
      onSuccess: () => {
        // NOTE: As createDirectory can be called to create both directory/resourceRoom,
        // we need to invalidate both keys to trigger a refetch (and redirect)
        queryClient.invalidateQueries([DIR_CONTENT_KEY, { siteName }])
        queryClient.invalidateQueries([RESOURCE_ROOM_NAME_KEY, { siteName }])
      },
    }
  )
}
