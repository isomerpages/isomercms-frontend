import axios from "axios"
import { createContext, useEffect, useState, useContext } from "react"

import { SITES_IS_PRIVATE_KEY } from "constants/constants"

const { REACT_APP_BACKEND_URL: BACKEND_URL } = process.env
const LOCAL_STORAGE_USER_ID_KEY = "userId"
const LOCAL_STORAGE_USER_EMAIL_KEY = "userEmail"
const LOCAL_STORAGE_USER_CONTACT_NUMBER = "userContactNumber"
const LOCAL_STORAGE_USER = "user"

const LoginContext = createContext(null)

const LoginConsumer = ({ children }) => {
  const loginContextData = useContext(LoginContext)
  if (!loginContextData)
    throw new Error("useLoginContext must be used within an LoginProvider")

  return <LoginContext.Consumer>{children}</LoginContext.Consumer>
}

const LoginProvider = ({ children }) => {
  const [userId, setUserId] = useState(
    localStorage.getItem(LOCAL_STORAGE_USER_ID_KEY)
  )

  const storedUser = localStorage.getItem(LOCAL_STORAGE_USER)
  const user = storedUser ? JSON.parse(storedUser) : {}

  const [email, setEmail] = useState(user.email)
  const [contactNumber, setContactNumber] = useState(user.contactNumber)

  const verifyLoginAndSetLocalStorage = async () => {
    const resp = await axios.get(`${BACKEND_URL}/auth/whoami`)
    const {
      userId: returnedUserId,
      email: returnedEmail,
      contactNumber: returnedContactNumber,
    } = resp.data

    if (returnedUserId) {
      setUserId(returnedUserId)
      localStorage.setItem(LOCAL_STORAGE_USER_ID_KEY, returnedUserId)
    }

    const loggedInUser = {}
    if (returnedEmail) {
      setEmail(returnedEmail)
      loggedInUser.email = returnedEmail
    }

    if (returnedContactNumber) {
      setContactNumber(returnedContactNumber)
      loggedInUser.contactNumber = returnedContactNumber
    }

    localStorage.setItem(LOCAL_STORAGE_USER, JSON.stringify(loggedInUser))
  }

  const logout = async () => {
    await axios.delete(`${BACKEND_URL}/auth/logout`)
    localStorage.removeItem(LOCAL_STORAGE_USER_ID_KEY)
    localStorage.removeItem(LOCAL_STORAGE_USER)
    localStorage.removeItem(SITES_IS_PRIVATE_KEY)
    setUserId(null)
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
    userId,
    email,
    contactNumber,
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
