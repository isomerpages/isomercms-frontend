import axios from "axios"
import { useQuery } from "react-query"
import Policy from "csp-parse"
import { errorToast } from "../../utils/toasts"
import useRedirectHook from "../useRedirectHook"
import { CSP_CONTENT_KEY } from "../queryKeys"

const getCsp = async ({ siteName }) => {
  const resp = await axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/netlify-toml`
  )
  const { netlifyTomlHeaderValues } = resp.data

  const csp = new Policy(netlifyTomlHeaderValues["Content-Security-Policy"])
  return csp
}

export function useCspHook({ siteName }, queryParams) {
  const { setRedirectToNotFound } = useRedirectHook()
  return useQuery([CSP_CONTENT_KEY, { siteName }], () => getCsp({ siteName }), {
    ...queryParams,
    retry: false,
    onError: (err) => {
      if (err.response && err.response.status === 404) {
        setRedirectToNotFound(siteName)
      } else {
        errorToast(
          `There was a problem trying to load your page. ${DEFAULT_RETRY_MSG}`
        )
      }
    },
  })
}
