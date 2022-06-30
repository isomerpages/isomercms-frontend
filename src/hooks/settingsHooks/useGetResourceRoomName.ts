import axios from "axios"
import { useQuery, UseQueryResult } from "react-query"

import { RESOURCE_ROOM_NAME_KEY } from "hooks/queryKeys"

const getResourceRoomName = async (siteName: string) => {
  const resp = await axios.get<{ resourceRoomName: string }>(
    `${process.env.REACT_APP_BACKEND_URL_V2}/sites/${siteName}/resourceRoom`
  )
  const { resourceRoomName } = resp.data
  return resourceRoomName
}

export const useGetResourceRoomName = (
  siteName: string
): UseQueryResult<string> => {
  return useQuery([RESOURCE_ROOM_NAME_KEY, { siteName }], () =>
    getResourceRoomName(siteName)
  )
}
