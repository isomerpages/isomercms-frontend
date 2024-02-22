import { AxiosError } from "axios"
import { useMutation, UseMutationResult, useQueryClient } from "react-query"

import { SITE_LINK_CHECKER_STATUS_KEY } from "constants/queryKeys"

import * as LinkCheckerService from "services/LinkCheckerService"

export const useRefreshLinkChecker = (
  siteName: string
): UseMutationResult<void, AxiosError, string> => {
  const queryClient = useQueryClient()
  return useMutation<void, AxiosError, string>(
    async () => {
      await LinkCheckerService.refreshLinkChecker({ siteName })
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries([SITE_LINK_CHECKER_STATUS_KEY, siteName])
      },
    }
  )
}
