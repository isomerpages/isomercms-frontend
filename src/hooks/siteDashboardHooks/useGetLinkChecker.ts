import { UseQueryResult, useQuery } from "react-query"

import { SITE_LINK_CHECKER_STATUS_KEY } from "constants/queryKeys"

import * as LinkCheckerService from "services/LinkCheckerService"

import { RepoErrorDto } from "types/linkReport"

export const useGetBrokenLinks = (
  siteName: string,
  isBrokenLinksReporterEnabled: boolean
): UseQueryResult<RepoErrorDto> => {
  return useQuery<RepoErrorDto>(
    [SITE_LINK_CHECKER_STATUS_KEY, siteName],
    () => {
      return LinkCheckerService.getLinkCheckerStatus({
        siteName,
        isBrokenLinksReporterEnabled,
      })
    },
    {
      retry: false,
      refetchInterval: 1000 * 10,
    }
  )
}
