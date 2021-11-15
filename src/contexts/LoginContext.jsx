import axios from "axios"
import React, { createContext, useEffect, useState, useContext } from "react"

import { SITES_IS_PRIVATE_KEY } from "constants/constants"

const { REACT_APP_BACKEND_URL: BACKEND_URL } = process.env
const LOCAL_STORAGE_USER_ID_KEY = "userId"

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

  const verifyLoginAndSetLocalStorage = async () => {
    const resp = await axios.get(`${BACKEND_URL}/auth/whoami`)
    const { userId } = resp.data
    if (userId) {
      setUserId(userId)
      localStorage.setItem(LOCAL_STORAGE_USER_ID_KEY, userId)
    }
  }

  const logout = async () => {
    await axios.delete(`${BACKEND_URL}/auth/logout`)
    localStorage.removeItem(LOCAL_STORAGE_USER_ID_KEY)
    localStorage.removeItem(SITES_IS_PRIVATE_KEY)
    setUserId(null)
  }

  // Set interceptors to log users out if an error occurs within the LoginProvider
  axios.interceptors.response.use(
    function (response) {
      return response
    },
    async function (error) {
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
    logout,
  }

  return (
    <LoginContext.Provider value={loginContextData}>
      {children}
    </LoginContext.Provider>
  )
}

export { LoginContext, LoginConsumer, LoginProvider }
