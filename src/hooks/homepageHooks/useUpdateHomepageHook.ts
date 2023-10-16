import { AxiosError } from "axios"
import {
  UseMutationResult,
  useQueryClient,
  useMutation,
  UseMutationOptions,
} from "react-query"

import { GET_HOMEPAGE_KEY } from "constants/queryKeys"

import { HomepageService } from "services"
import { MiddlewareError } from "types/error"
import { HomepageDto } from "types/homepage"
import { useSuccessToast, useErrorToast, DEFAULT_RETRY_MSG } from "utils"

export const useUpdateHomepageHook = (
  siteName: string,
  mutationOptions?: Omit<
    UseMutationOptions<void, AxiosError<MiddlewareError>, HomepageDto>,
    "mutationFn" | "mutationKey"
  >
): UseMutationResult<void, AxiosError<MiddlewareError>, HomepageDto> => {
  const queryClient = useQueryClient()
  const successToast = useSuccessToast()
  const errorToast = useErrorToast()

  return useMutation(
    (homepageData: HomepageDto) =>
      HomepageService.updateHomepage(siteName, homepageData),
    {
      ...mutationOptions,
      onSettled: () => {
        queryClient.invalidateQueries([GET_HOMEPAGE_KEY, siteName])
      },
      onSuccess: (data, variables, context) => {
        successToast({
          id: "update-homepage-success",
          description: "Homepage updated successfully",
        })
        if (mutationOptions?.onSuccess)
          mutationOptions.onSuccess(data, variables, context)
      },
      onError: (err, variables, context) => {
        if (err.response?.status !== 409) {
          errorToast({
            id: "update-homepage-error",
            description: `Could not update homepage. ${DEFAULT_RETRY_MSG}. Error: ${err.response?.data?.message}`,
          })
        }
        if (mutationOptions?.onError)
          mutationOptions.onError(err, variables, context)
      },
    }
  )
}
