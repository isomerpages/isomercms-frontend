import { AxiosError } from "axios"
import { useMutation, UseMutationResult } from "react-query"

import * as LoginService from "services/LoginService"

import { getAxiosErrorMessage } from "utils/axios"
import { useErrorToast } from "utils/toasts"

import { GetSgidAuthUrlResponseDto } from "types/login"

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
      onError: (err) => {
        errorToast({
          id: "sgid-oauth-error",
          description: getAxiosErrorMessage(err),
        })
      },
    }
  )
}
