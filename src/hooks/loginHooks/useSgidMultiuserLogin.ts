import { AxiosError } from "axios"
import { useMutation, UseMutationResult } from "react-query"
import { useHistory } from "react-router-dom"

import * as LoginService from "services/LoginService"

import { VerifySgidMultiuserLoginParams } from "types/login"

export const useSgidMultiuserLogin = (): UseMutationResult<
  void,
  AxiosError,
  VerifySgidMultiuserLoginParams
> => {
  const history = useHistory()
  return useMutation<void, AxiosError, VerifySgidMultiuserLoginParams>(
    (body) => LoginService.verifySgidMultiuserLogin(body),
    {
      onSuccess: () => {
        history.push("/sites")
      },
      onError: (err: AxiosError) => {
        history.push(`?status=${err.response?.status}`)
      },
    }
  )
}
