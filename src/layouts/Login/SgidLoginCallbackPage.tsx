import { useLocation } from "react-router-dom"

import { useSgidLogin } from "hooks/loginHooks/useSgidLogin"

export const SgidLoginCallbackPage = (): JSX.Element => {
  const { search } = useLocation()
  const urlSearchParams = new URLSearchParams(search)
  const params = Object.fromEntries(urlSearchParams.entries())
  const { state, code } = params

  useSgidLogin({ state, code })

  return <>Taking you back to IsomerCMS...</>
}
