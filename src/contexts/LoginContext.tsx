import axios from "axios"
import {
  createContext,
  useEffect,
  useContext,
  PropsWithChildren,
  useCallback,
} from "react"

import { LOCAL_STORAGE_KEYS } from "constants/localStorage"

import { useLocalStorage } from "hooks/useLocalStorage"

import { LoggedInUser } from "types/user"

const { REACT_APP_BACKEND_URL_V2: BACKEND_URL } = process.env

interface LoginContextProps extends LoggedInUser {
  logout: () => Promise<void>
  verifyLoginAndSetLocalStorage: () => Promise<void>
}

const LoginContext = createContext<null | LoginContextProps>(null)

const useLoginContext = (): LoginContextProps => {
  const loginContextData = useContext(LoginContext)
  if (!loginContextData)
    throw new Error("useLoginContext must be used within an LoginProvider")

  return loginContextData
}

const LoginProvider = ({
  children,
}: PropsWithChildren<Record<string, never>>): JSX.Element => {
  const [storedUserId, setStoredUserId, removeStoredUserId] = useLocalStorage(
    LOCAL_STORAGE_KEYS.GithubId,
    "Unknown user"
  )
  const [
    storedUser,
    setStoredUser,
    removeStoredUser,
  ] = useLocalStorage(LOCAL_STORAGE_KEYS.User, { email: "", contactNumber: "" })
  const [
    storedUserEmail,
    setStoredUserEmail,
    removeStoredUserEmail,
  ] = useLocalStorage(LOCAL_STORAGE_KEYS.Email, "Unknown email")

  const [, , removeSites] = useLocalStorage(
    LOCAL_STORAGE_KEYS.SitesIsPrivate,
    false
  )
  const verifyLoginAndSetLocalStorage = useCallback(async () => {
    const { data: loggedInUser } = await axios.get<LoggedInUser>(
      `${BACKEND_URL}/auth/whoami`
    )

    setStoredUserId(loggedInUser.userId)
    setStoredUser(loggedInUser)
    setStoredUserEmail(loggedInUser.email)
  }, [setStoredUser, setStoredUserEmail, setStoredUserId])

  const logout = async () => {
    await axios.delete(`${BACKEND_URL}/auth/logout`)
    removeStoredUserId()
    removeStoredUser()
    removeStoredUserEmail()
    removeSites()
    // NOTE: This is REQUIRED (emphasis here) for auto-redirect on removal of stored user id.
    // This is IN ADDITION to removing the value associated with the key.
    setStoredUserId("")
    setStoredUserEmail("")
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
    // Dependency array must be empty here - the pointer to the verify callback method doesn't seem to be stable so this useEffect would be called repeatedly
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Run only once

  const loginContextData = {
    userId: storedUserId,
    email: storedUserEmail,
    contactNumber: storedUser.contactNumber,
    logout,
    verifyLoginAndSetLocalStorage,
    displayedName: `${storedUserId ? "@" : ""}${
      storedUserId || storedUserEmail
    }`,
  }

  return (
    <LoginContext.Provider value={loginContextData}>
      {children}
    </LoginContext.Provider>
  )
}

export { LoginContext, useLoginContext, LoginProvider }
