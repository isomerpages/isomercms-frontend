import { useQuery } from "react-query"

import { CSP_CONTENT_KEY } from "constants/queryKeys"

import * as CspService from "services/CspService"

import { useErrorToast } from "utils/toasts"

import { DEFAULT_RETRY_MSG } from "utils"

export function useCspHook() {
  const errorToast = useErrorToast()
  return useQuery([CSP_CONTENT_KEY], () => CspService.get(), {
    retry: false,
    initialData: {},
    onError: () => {
      errorToast({
        id: "get-csp-error",
        description: `There was a problem trying to load your CSP. ${DEFAULT_RETRY_MSG}`,
      })
    },
  })
}
