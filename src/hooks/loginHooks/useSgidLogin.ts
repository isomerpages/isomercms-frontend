import { AxiosError } from "axios"
import { useQuery, UseQueryResult } from "react-query"
import { useHistory } from "react-router-dom"

import { SGID_QUERY_KEY } from "constants/queryKeys"

import * as LoginService from "services/LoginService"

import { PublicOfficerData, VerifySgidLoginParams } from "types/login"

export const useSgidLogin = (
  body: VerifySgidLoginParams
): UseQueryResult<PublicOfficerData[]> => {
  const history = useHistory()
  return useQuery(
    [SGID_QUERY_KEY, body],
    () =>
      LoginService.verifySgidLogin(body).then((data) => {
        return data.userData
      }),
    {
      onError: (err: AxiosError) => {
        history.push(`?status=${err.response?.status}`)
      },
    }
  )
}
