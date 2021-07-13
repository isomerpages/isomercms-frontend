import axios from "axios"
import { useQuery } from "react-query"
import { errorToast } from "../utils/toasts"
import useRedirectHook from "./useRedirectHook"
import { CSP_CONTENT_KEY } from "./queryKeys"

const getCSP = async (siteName) => {
  // retrieve CSP
  const resp = await axios.get(
    `${process.env.REACT_APP_BACKEND_URL}/sites/${siteName}/netlify-toml`
  )
  return resp.data
}

export function useCSPHook({ siteName }) {
  const { setRedirectToNotFound } = useRedirectHook()
  return useQuery([CSP_CONTENT_KEY, { siteName }], () => getCSP(siteName), {
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
