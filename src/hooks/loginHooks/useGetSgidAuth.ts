import { AxiosError } from "axios"
import { useMutation, UseMutationResult } from "react-query"

import * as LoginService from "services/LoginService"

import { getAxiosErrorMessage } from "utils/axios"
import { useErrorToast } from "utils/toasts"

import { SgidAuthUrlResponseDto } from "types/login"

export const useGetSgidAuth = (): UseMutationResult<
  SgidAuthUrlResponseDto,
  AxiosError,
  void
> => {
  const errorToast = useErrorToast()
  return useMutation<SgidAuthUrlResponseDto, AxiosError, void>(
    () => LoginService.getSgidAuthUrl(),
    {
      onSuccess: (data) => {
        window.location.assign(data.redirectUrl)
      },
      onError: (err) => {
        errorToast({
          id: "sgid-oauth-error",
          description: getAxiosErrorMessage(err),
        })
      },
    }
  )
}
