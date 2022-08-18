import { useQuery, UseQueryResult } from "react-query"

import { RESOURCE_ROOM_NAME_KEY } from "constants/queryKeys"

import * as DirectoryService from "services/DirectoryService/DirectoryService"

export const useGetResourceRoomName = (
  siteName: string
): UseQueryResult<string> => {
  return useQuery([RESOURCE_ROOM_NAME_KEY, { siteName }], () =>
    DirectoryService.getResourceRoomName(siteName)
  )
}
