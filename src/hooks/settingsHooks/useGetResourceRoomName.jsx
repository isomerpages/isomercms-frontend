import axios from "axios"
import { useQuery } from "react-query"

import { RESOURCE_ROOM_NAME_KEY } from "hooks/queryKeys"

const getResourceRoomName = async ({ siteName }) => {
  const resp = await axios.get(
    `${process.env.REACT_APP_BACKEND_URL_V2}/sites/${siteName}/resourceRoom`
  )
  const { resourceRoomName } = resp.data
  return resourceRoomName
}

export function useGetResourceRoomNameHook(params, queryParams) {
  return useQuery(
    [RESOURCE_ROOM_NAME_KEY, { ...params }],
    () => getResourceRoomName(params),
    {
      ...queryParams,
    }
  )
}
