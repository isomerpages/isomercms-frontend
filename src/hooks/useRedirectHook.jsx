import { useContext, useEffect, useState } from "react"
import { useHistory } from "react-router-dom"
import axios from 'axios'

// Import context
const { LoginContext } = require('../contexts/LoginContext')

// constants
const userIdKey = "userId"
const BACKEND_URL = process.env.REACT_APP_BACKEND_URL

const useRedirectHook = () => {
  const [shouldRedirect, setShouldRedirect] = useState(false)
  const [redirectUrl, setRedirectUrl] = useState('')
  const [redirectComponentState, setRedirectComponentState] = useState({})
  const history = useHistory()
  const { setLogoutState } = useContext(LoginContext)

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

  const setRedirectToLogout = async () => {
    try {
      // Call the logout endpoint in the API server to clear the browser cookie
      localStorage.removeItem(userIdKey)
      await axios.get(`${BACKEND_URL}/auth/logout`)
      setRedirectUrl("/")
      setRedirectComponentState({ isFromSignOutButton: true })
      setShouldRedirect(true)
      setLogoutState()
    } catch (err) {
      console.error(err)
    }
  }

  return { setRedirectToNotFound, setRedirectToPage, setRedirectToLogout }
}

export default useRedirectHook;