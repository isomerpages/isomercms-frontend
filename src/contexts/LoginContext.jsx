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
  const [, setUserId, removeUserId] = useLocalStorage(
    LOCAL_STORAGE_KEYS.GithubId
  )

  const [user, setUser, removeUser] = useLocalStorage(LOCAL_STORAGE_KEYS.User)
  const [, , removeSites] = useLocalStorage(LOCAL_STORAGE_KEYS.SitesIsPrivate)
  const verifyLoginAndSetLocalStorage = async () => {
    const { data } = await axios.get(`${BACKEND_URL}/auth/whoami`)
    const loggedInUser = omitBy(data, isEmpty)

    if (loggedInUser.userId) {
      setUserId(loggedInUser.userId)
    }
    setUser(loggedInUser)
  }

  const logout = async () => {
    await axios.delete(`${BACKEND_URL}/auth/logout`)
    removeUserId()
    removeUser()
    removeSites()
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
    ...user,
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
