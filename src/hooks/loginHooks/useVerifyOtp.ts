import { AxiosError } from "axios"
import { useMutation, UseMutationResult } from "react-query"

import * as LoginService from "services/LoginService"

import { VerifyOtpParams } from "types/login"

export const useVerifyOtp = (): UseMutationResult<
  void,
  AxiosError,
  VerifyOtpParams
> => {
  return useMutation<void, AxiosError, VerifyOtpParams>((body) =>
    LoginService.verifyLoginOtp(body)
  )
}
