import { AxiosError } from "axios"
import { useQuery, UseQueryResult } from "react-query"

import * as LoginService from "services/LoginService"

import { PublicOfficerData, VerifySgidLoginParams } from "types/login"

export const useSgidLogin = (
  body: VerifySgidLoginParams
): UseQueryResult<PublicOfficerData[]> => {
  return useQuery(
    [body],
    () =>
      LoginService.verifySgidLogin(body).then((data) => {
        return data.userData
      }),
    {
      onError: (err: AxiosError) => {
        window.location.replace(`/ogp-login?status=${err.response?.status}`)
      },
    }
  )
}
