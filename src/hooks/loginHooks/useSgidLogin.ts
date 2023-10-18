import { AxiosError } from "axios"
import { useQuery, UseQueryResult } from "react-query"

import { SGID_QUERY_KEY } from "constants/queryKeys"

import * as LoginService from "services/LoginService"

import { PublicOfficerData, VerifySgidLoginParams } from "types/login"

export const useSgidLogin = (
  body: VerifySgidLoginParams
): UseQueryResult<PublicOfficerData[]> => {
  return useQuery(
    [SGID_QUERY_KEY, body],
    () =>
      LoginService.verifySgidLogin(body).then((data) => {
        return data.userData
      }),
    {
      onError: (err: AxiosError) => {
        window.location.replace(`/?status=${err.response?.status}`)
      },
    }
  )
}
