import axios from "axios"
import Policy from "csp-parse"
import { useQuery } from "react-query"

import { CSP_CONTENT_KEY } from "hooks/queryKeys"

import { errorToast } from "utils/toasts"

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
  return useQuery([CSP_CONTENT_KEY, { siteName }], () => getCsp({ siteName }), {
    ...queryParams,
    retry: false,
    initialData: new Policy(),
    onError: () => {
      errorToast(
        `There was a problem trying to load your CSP. ${DEFAULT_RETRY_MSG}`
      )
      queryParams && queryParams.onError && queryParams.onError()
    },
  })
}
