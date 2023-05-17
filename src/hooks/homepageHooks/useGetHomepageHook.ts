import { AxiosError } from "axios"
import { UseQueryResult, useQuery } from "react-query"

import { GET_HOMEPAGE_KEY } from "constants/queryKeys"

import { HomepageService } from "services"
import { HomepageDto } from "types/homepage"
import { useErrorToast, DEFAULT_RETRY_MSG } from "utils"

export const useGetHomepageHook = (
  siteName: string
): UseQueryResult<HomepageDto> => {
  const errorToast = useErrorToast()
  return useQuery(
    [GET_HOMEPAGE_KEY, siteName],
    () => HomepageService.getHomepage(siteName),
    {
      onError: (err: AxiosError) => {
        errorToast({
          description: `Your homepage could not be retrieved. ${DEFAULT_RETRY_MSG}. Error: ${err.response?.data.error.message}`,
        })
      },
    }
  )
}
