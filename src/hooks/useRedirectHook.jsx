import { useContext, useEffect, useState } from "react"
import { useHistory, useLocation } from "react-router-dom"

// Import contexts
const { LoginContext } = require("contexts/LoginContext")

const useRedirectHook = () => {
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [redirectUrl, setRedirectUrl] = useState("")
  const [redirectComponentState, setRedirectComponentState] = useState({})
  const history = useHistory()
  const location = useLocation()
  const { logout } = useContext(LoginContext)

  useEffect(() => {
    if (shouldRedirect) {
      setShouldRedirect(false)
      history.push({
        pathname: redirectUrl,
        state: { ...redirectComponentState, from: location.pathname },
      })
    }
  }, [history, location, redirectComponentState, redirectUrl, shouldRedirect])

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
