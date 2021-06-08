import { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"

import { LoginContext } from "@contexts/LoginContext"

// constants
const userIdKey = "userId"
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

const useRedirectHook = () => {
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [redirectUrl, setRedirectUrl] = useState("")
  const [redirectComponentState, setRedirectComponentState] = useState({})
  const history = useHistory()
  const { logout } = useContext(LoginContext)

  useEffect(() => {
    if (shouldRedirect) {
      setShouldRedirect(false)
      history.push({
        pathname: redirectUrl,
        state: redirectComponentState,
      })
    }
  }, [shouldRedirect])

  const setRedirectToNotFound = (siteName) => {
    setRedirectUrl("/not-found")
    setRedirectComponentState({ siteName })
    setShouldRedirect(true)
  }

  const setRedirectToPage = (url) => {
    setRedirectUrl(url)
    setShouldRedirect(true)
  }

  const setRedirectToLogout = async () => {
    try {
      await logout()
      setRedirectComponentState({ isFromSignOutButton: true })
      setShouldRedirect(true)
    } catch (err) {
      console.error(err)
    }
  }

  return { setRedirectToNotFound, setRedirectToPage, setRedirectToLogout }
}

export default useRedirectHook
