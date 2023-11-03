import { useFeatureIsOn } from "@growthbook/growthbook-react"

import { FEATURE_FLAGS } from "constants/featureFlags"

import { FeatureFlags } from "types/featureFlags"
import { StagingBuildStatus } from "types/stagingBuildStatus"

import { apiService } from "./ApiService"

export const getStagingBuildStatus = async ({
  siteName,
}: {
  siteName: string
}): Promise<StagingBuildStatus | undefined> => {
  // const isOn = useFeatureIsOn<FeatureFlags>(
  //   FEATURE_FLAGS.IS_SHOW_STAGING_BUILD_STATUS_ENABLED
  // )
  // if (isOn) {
  //   return undefined
  // }
  const endpoint = `/sites/${siteName}/getStagingBuildStatus`

  return apiService.get(endpoint).then((res) => res.data)
}
