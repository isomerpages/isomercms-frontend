import { AxiosError } from "axios"
import { useQuery, UseQueryResult } from "react-query"

import * as LoginService from "services/LoginService"

import { VerifySgidLoginParams } from "types/login"

export const useSgidLogin = (
  body: VerifySgidLoginParams
): UseQueryResult<void> => {
  return useQuery([body], () => LoginService.verifySgidLogin(body), {
    onSuccess: () => {
      window.location.replace("/sites")
    },
    onError: (err: AxiosError) => {
      window.location.replace(`/ogp-login?status=${err.response?.status}`)
    },
  })
}
