import { useEffect, useState } from "react"
import { useHistory } from "react-router-dom"

const useRedirectHook = () => {
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [redirectUrl, setRedirectUrl] = useState('')
  const [redirectComponentState, setRedirectComponentState] = useState({})
  const history = useHistory()

  useEffect(() => {
    if (shouldRedirect) {
      setShouldRedirect(false)
      history.push({
        pathname: redirectUrl,
        state: redirectComponentState
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

  const setRedirectToLogout = () => {
    setRedirectUrl("/")
    setRedirectComponentState({ isFromSignOutButton: true })
    setShouldRedirect(true)
  }

  return { setRedirectToNotFound, setRedirectToPage, setRedirectToLogout }
}

export default useRedirectHook;