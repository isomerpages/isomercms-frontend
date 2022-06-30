import axios from "axios"
import { isEmpty, omitBy } from "lodash"
import { createContext, useEffect, useContext } from "react"

import { LOCAL_STORAGE_KEYS } from "constants/localStorage"

import { useLocalStorage } from "hooks/useLocalStorage"

const { REACT_APP_BACKEND_URL: BACKEND_URL } = process.env

const LoginContext = createContext(null)

const LoginConsumer = ({ children }) => {
  const loginContextData = useContext(LoginContext)
  if (!loginContextData)
    throw new Error("useLoginContext must be used within an LoginProvider")

  return <LoginContext.Consumer>{children}</LoginContext.Consumer>
}

const LoginProvider = ({ children }) => {
  const [storedUserId, setStoredUserId, removeStoredUserId] = useLocalStorage(
    LOCAL_STORAGE_KEYS.GithubId,
    "Unknown user"
  )
  const [storedUser, setStoredUser, removeStoredUser] = useLocalStorage(
    LOCAL_STORAGE_KEYS.User,
    {}
  )

  const [, , removeSites] = useLocalStorage(LOCAL_STORAGE_KEYS.SitesIsPrivate)
  const verifyLoginAndSetLocalStorage = async () => {
    const { data } = await axios.get(`${BACKEND_URL}/auth/whoami`)
    const loggedInUser = omitBy(data, isEmpty)

    setStoredUserId(loggedInUser.userId)
    setStoredUser(loggedInUser)
  }

  const logout = async () => {
    await axios.delete(`${BACKEND_URL}/auth/logout`)
    removeStoredUserId()
    removeStoredUser()
    removeSites()
    // NOTE: This is REQUIRED (emphasis here) for auto-redirect on removal of stored user id.
    // This is IN ADDITION to removing the value associated with the key.
    setStoredUserId(null)
  }

  // Set interceptors to log users out if an error occurs within the LoginProvider
  axios.interceptors.response.use(
    (response) => {
      return response
    },
    async (error) => {
      if (error.response && error.response.status === 401) {
        await logout()
      }
      return Promise.reject(error)
    }
  )

  useEffect(() => {
    verifyLoginAndSetLocalStorage()
  }, []) // Run only once

  const loginContextData = {
    userId: storedUserId,
    email: storedUser.email,
    contactNumber: storedUser.contactNumber,
    logout,
    verifyLoginAndSetLocalStorage,
  }

  return (
    <LoginContext.Provider value={loginContextData}>
      {children}
    </LoginContext.Provider>
  )
}

export { LoginContext, LoginConsumer, LoginProvider }
