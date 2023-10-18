import { AxiosError } from "axios"
import { useMutation, UseMutationResult } from "react-query"

import * as LoginService from "services/LoginService"

import { VerifySgidMultiuserLoginParams } from "types/login"

export const useSgidMultiuserLogin = (): UseMutationResult<
  void,
  AxiosError,
  VerifySgidMultiuserLoginParams
> => {
  return useMutation<void, AxiosError, VerifySgidMultiuserLoginParams>(
    (body) => LoginService.verifySgidMultiuserLogin(body),
    {
      onSuccess: () => {
        window.location.replace("/sites")
      },
      onError: (err: AxiosError) => {
        window.location.replace(`/?status=${err.response?.status}`)
      },
    }
  )
}
