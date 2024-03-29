import { RepoErrorDto } from "types/linkReport"

import { apiService } from "./ApiService"

export const getLinkCheckerStatus = async ({
  siteName,
  isBrokenLinksReporterEnabled,
}: {
  siteName: string
  isBrokenLinksReporterEnabled: boolean
}): Promise<RepoErrorDto> => {
  if (!isBrokenLinksReporterEnabled) {
    return {
      status: "error",
    }
  }
  const endpoint = `/sites/${siteName}/getLinkCheckerStatus`
  return (await apiService.get(endpoint)).data
}

export const refreshLinkChecker = async ({
  siteName,
}: {
  siteName: string
}): Promise<void> => {
  const endpoint = `/sites/${siteName}/checkLinks`
  return (await apiService.post(endpoint)).data
}
