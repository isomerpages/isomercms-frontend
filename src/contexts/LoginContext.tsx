import axios from "axios"
import {
  createContext,
  useEffect,
  useContext,
  PropsWithChildren,
  useCallback,
  useState,
} from "react"

import { LOCAL_STORAGE_KEYS } from "constants/localStorage"

import { useLocalStorage } from "hooks/useLocalStorage"

import { LoggedInUser, UserType, UserTypes } from "types/user"

const { REACT_APP_BACKEND_URL_V2: BACKEND_URL } = process.env

interface LoginContextProps extends LoggedInUser {
  isLoading: boolean
  logout: () => Promise<void>
  verifyLoginAndGetUserDetails: () => Promise<void>
  userType: UserType
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
  const [, , removeSites] = useLocalStorage(
    LOCAL_STORAGE_KEYS.SitesIsPrivate,
    false
  )
  const [isLoading, setIsLoading] = useState(true)
  const [storedUserId, setStoredUserId] = useState("")
  const [storedUserContact, setStoredUserContact] = useState("")
  const [storedUserEmail, setStoredUserEmail] = useState("")
  const verifyLoginAndGetUserDetails = useCallback(async () => {
    const { data: loggedInUser } = await axios.get<LoggedInUser>(
      `${BACKEND_URL}/auth/whoami`
    )

    setStoredUserId(loggedInUser.userId)
    setStoredUserContact(loggedInUser.contactNumber)
    setStoredUserEmail(loggedInUser.email)
    setIsLoading(false)
  }, [setStoredUserContact, setStoredUserEmail, setStoredUserId])

  const logout = async () => {
    await axios.delete(`${BACKEND_URL}/auth/logout`)
    setStoredUserId("")
    setStoredUserContact("")
    setStoredUserEmail("")
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
      setIsLoading(false)
      return Promise.reject(error)
    }
  )

  useEffect(() => {
    verifyLoginAndGetUserDetails()
    // Dependency array must be empty here - the pointer to the verify callback method doesn't seem to be stable so this useEffect would be called repeatedly
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // Run only once

  const loginContextData = {
    isLoading,
    userId: storedUserId,
    email: storedUserEmail,
    contactNumber: storedUserContact,
    logout,
    verifyLoginAndGetUserDetails,
    displayedName: `${storedUserId ? "@" : ""}${
      storedUserId || storedUserEmail
    }`,
    userType: storedUserId ? UserTypes.Github : UserTypes.Email,
  }

  return (
    <LoginContext.Provider value={loginContextData}>
      {children}
    </LoginContext.Provider>
  )
}

export { LoginContext, useLoginContext, LoginProvider }
