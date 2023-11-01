import { useQuery, UseQueryResult } from "react-query"

import { GET_STAGING_BUILD_STATUS_KEY } from "constants/queryKeys"

import { getStagingBuildStatus } from "services/StagingBuildService"

import { StagingBuildStatus } from "types/stagingBuildStatus"

export const useGetStagingStatus = (
  siteName: string
): UseQueryResult<StagingBuildStatus> => {
  return useQuery<StagingBuildStatus>(
    [GET_STAGING_BUILD_STATUS_KEY, siteName],
    () => getStagingBuildStatus({ siteName }),
    {
      retry: false,
      refetchInterval: 1000 * 30, // 30 sec
    }
  )
}
