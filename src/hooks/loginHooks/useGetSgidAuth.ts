import { AxiosError } from "axios"
import { useMutation, UseMutationResult } from "react-query"

import * as LoginService from "services/LoginService"

import { useErrorToast } from "utils/toasts"

import { GetSgidAuthUrlResponseDto } from "types/login"
import { DEFAULT_RETRY_MSG } from "utils"

export const useGetSgidAuth = (): UseMutationResult<
  GetSgidAuthUrlResponseDto,
  AxiosError,
  void
> => {
  const errorToast = useErrorToast()
  return useMutation<GetSgidAuthUrlResponseDto, AxiosError, void>(
    () => LoginService.getSgidAuthUrl(),
    {
      onSuccess: (data) => {
        window.location.assign(data.redirectUrl)
      },
      onError: () => {
        errorToast({
          id: "sgid-oauth-error",
          description: `Something went wrong. ${DEFAULT_RETRY_MSG}`,
        })
      },
    }
  )
}
