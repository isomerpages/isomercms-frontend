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
      // todo: ideally should invalidate on save, now got time lag
      refetchInterval: 1000 * 10, // 10 sec for quicker feedback when user press save
    }
  )
}
