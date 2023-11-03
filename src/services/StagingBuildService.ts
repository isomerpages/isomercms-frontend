import { StagingBuildStatus } from "types/stagingBuildStatus"

import { apiService } from "./ApiService"

export const getStagingBuildStatus = async ({
  siteName,
}: {
  siteName: string
}): Promise<StagingBuildStatus> => {
  const endpoint = `/sites/${siteName}/getStagingBuildStatus`
  return apiService.get(endpoint).then((res) => res.data)
}
