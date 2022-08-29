import { AxiosError } from "axios"
import { useMutation, UseMutationResult, useQueryClient } from "react-query"

import { RESOURCE_ROOM_NAME_KEY } from "constants/queryKeys"

import * as DirectoryService from "services/DirectoryService/index"

import { ResourceRoomNameUpdateProps } from "types/directory"

export const useUpdateResourceRoomName = (
  siteName: string,
  resourceRoomName: string
): UseMutationResult<void, AxiosError, ResourceRoomNameUpdateProps> => {
  const queryClient = useQueryClient()
  return useMutation(
    (body) => {
      return DirectoryService.updateResourceRoomName(
        siteName,
        resourceRoomName,
        body
      )
    },
    {
      retry: false,
      onSuccess: () => {
        queryClient.invalidateQueries([RESOURCE_ROOM_NAME_KEY, { siteName }])
      },
    }
  )
}
