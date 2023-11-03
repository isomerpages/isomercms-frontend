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
  const endpoint = `/sites/${siteName}/getStagingBuildStatus`

  return apiService.get(endpoint).then((res) => res.data)
}
