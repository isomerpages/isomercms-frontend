import { AxiosError } from "axios"
import { UseMutationResult, useQueryClient, useMutation } from "react-query"

import { GET_HOMEPAGE_KEY } from "constants/queryKeys"

import { HomepageService } from "services"
import { MiddlewareError } from "types/error"
import { HomepageDto } from "types/homepage"
import { useSuccessToast, useErrorToast, DEFAULT_RETRY_MSG } from "utils"

export const useUpdateHomepageHook = (
  siteName: string
): UseMutationResult<void, AxiosError<MiddlewareError>, HomepageDto> => {
  const queryClient = useQueryClient()
  const successToast = useSuccessToast()
  const errorToast = useErrorToast()
  return useMutation(
    (homepageData: HomepageDto) =>
      HomepageService.updateHomepage(siteName, homepageData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([GET_HOMEPAGE_KEY, siteName])
        successToast({ description: "Homepage updated successfully" })
      },
      onError: (err: AxiosError) => {
        errorToast({
          description: `Could not update homepage. ${DEFAULT_RETRY_MSG}. Error: ${err.response?.data.error.message}`,
        })
      },
    }
  )
}
