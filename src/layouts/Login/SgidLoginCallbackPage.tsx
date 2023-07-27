import { useLocation } from "react-router-dom"

import { useSgidLogin } from "hooks/loginHooks"

export const SgidLoginCallbackPage = (): JSX.Element => {
  const { search } = useLocation()
  const urlSearchParams = new URLSearchParams(search)
  const params = Object.fromEntries(urlSearchParams.entries())
  const { code } = params

  useSgidLogin({ code })

  return <>Taking you back to IsomerCMS...</>
}
