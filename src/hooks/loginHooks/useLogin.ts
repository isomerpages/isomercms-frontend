import { AxiosError } from "axios"
import { useMutation, UseMutationResult } from "react-query"

import * as LoginService from "services/LoginService"

import { LoginParams } from "types/login"

export const useLogin = (): UseMutationResult<
  void,
  AxiosError,
  LoginParams
> => {
  return useMutation<void, AxiosError, LoginParams>((body) =>
    LoginService.sendLoginOtp(body)
  )
}
