import React, { useEffect } from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { BrowserRouter as Router } from "react-router-dom"
import { ToastContainer } from "react-toastify"
// we need to import react-toastify before our styles, but that is
// incompatible with our code linting sorting order. There is no
// easy way around this (see https://github.com/lydell/eslint-plugin-simple-import-sort/issues/8)
// so we are importing react-toastify styles as an unused import for now
// eslint-disable-next-line no-unused-vars
import reactToastifyStyles from "react-toastify/dist/ReactToastify.css"

import axios from "axios"

import { LoginProvider } from "@contexts/LoginContext"

import elementStyles from "@styles/isomer-cms/Elements.module.scss"

import { RouteSelector } from "@routing/RouteSelector"

// axios settings
axios.defaults.withCredentials = true

// Constants
const LOCAL_STORAGE_SITE_COLORS = "isomercms_colors"

const ToastCloseButton = ({ closeToast }) => (
  <span
    style={{
      display: "inline-flex",
      alignItems: "center",
    }}
  >
    <i className="bx bx-x bx-sm" onClick={closeToast} />
  </span>
)

// react-query client
const queryClient = new QueryClient()

export const App = () => {
  useEffect(() => {
    localStorage.removeItem(LOCAL_STORAGE_SITE_COLORS)
  }, [])

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <QueryClientProvider client={queryClient}>
        <ToastContainer
          hideProgressBar
          position="top-center"
          closeButton={ToastCloseButton}
          className={elementStyles.toastContainer}
        />
        <LoginProvider>
          <RouteSelector />
        </LoginProvider>
      </QueryClientProvider>
    </Router>
  )
}