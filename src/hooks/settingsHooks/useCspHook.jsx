import axios from "axios"
import Policy from "csp-parse"
import { useQuery } from "react-query"

import { CSP_CONTENT_KEY } from "constants/queryKeys"

import { useErrorToast } from "utils/toasts"

import { DEFAULT_RETRY_MSG } from "utils"

const getCsp = async ({ siteName }) => {
  const resp = await axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/netlify-toml`
  )
  const { netlifyTomlHeaderValues } = resp.data

  const csp = new Policy(netlifyTomlHeaderValues["Content-Security-Policy"])
  return csp
}

export function useCspHook({ siteName }, queryParams) {
  const errorToast = useErrorToast()
  return useQuery([CSP_CONTENT_KEY, { siteName }], () => getCsp({ siteName }), {
    ...queryParams,
    retry: false,
    initialData: new Policy(),
    onError: () => {
      errorToast({
        description: `There was a problem trying to load your CSP. ${DEFAULT_RETRY_MSG}`,
      })
      if (queryParams && queryParams.onError) queryParams.onError()
    },
  })
}
