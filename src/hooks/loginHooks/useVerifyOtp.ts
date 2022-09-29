import { AxiosError } from "axios"
import { useMutation, UseMutationResult } from "react-query"

import { useLoginContext } from "contexts/LoginContext"

import * as LoginService from "services/LoginService"

import { VerifyOtpParams } from "types/login"

export const useVerifyOtp = (): UseMutationResult<
  void,
  AxiosError,
  VerifyOtpParams
> => {
  const { verifyLoginAndSetLocalStorage } = useLoginContext()
  return useMutation<void, AxiosError, VerifyOtpParams>(
    (body) => LoginService.verifyLoginOtp(body),
    {
      onSuccess: verifyLoginAndSetLocalStorage,
    }
  )
}
