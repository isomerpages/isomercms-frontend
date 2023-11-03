import { useFeatureIsOn } from "@growthbook/growthbook-react"
import { useQuery, UseQueryResult } from "react-query"

import { FEATURE_FLAGS } from "constants/featureFlags"
import { GET_STAGING_BUILD_STATUS_KEY } from "constants/queryKeys"

import { getStagingBuildStatus } from "services/StagingBuildService"

import { FeatureFlags } from "types/featureFlags"
import { StagingBuildStatus } from "types/stagingBuildStatus"

export const useGetStagingStatus = (
  siteName: string
): UseQueryResult<StagingBuildStatus | undefined> => {
  return useQuery<StagingBuildStatus | undefined>(
    [GET_STAGING_BUILD_STATUS_KEY, siteName],
    () =>
      useFeatureIsOn<FeatureFlags>(
        FEATURE_FLAGS.IS_SHOW_STAGING_BUILD_STATUS_ENABLED
      )
        ? getStagingBuildStatus({ siteName })
        : Promise.resolve(undefined),
    {
      retry: false,
      refetchInterval: 1000 * 5, // 5 sec for quicker feedback when user press save
    }
  )
}
