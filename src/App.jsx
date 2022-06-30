import { ThemeProvider } from "@opengovsg/design-system-react"
import axios from "axios"
import { useEffect } from "react"
import { QueryClient, QueryClientProvider } from "react-query"
import { BrowserRouter as Router } from "react-router-dom"

// Import contexts
import { LoginProvider } from "contexts/LoginContext"
import { ServicesProvider } from "contexts/ServicesContext"

// Import route selector
import { RouteSelector } from "routing/RouteSelector"

import theme from "theme"

// axios settings
axios.defaults.withCredentials = true

// Constants
const LOCAL_STORAGE_SITE_COLORS = "isomercms_colors"

// react-query client
const queryClient = new QueryClient()

// api client
const API_BASE_URL_V2 = `${process.env.REACT_APP_BACKEND_URL_V2}`
const apiClient = axios.create({
  baseURL: API_BASE_URL_V2,
  timeout: 100000, // 100 secs
})

const App = () => {
  useEffect(() => {
    localStorage.removeItem(LOCAL_STORAGE_SITE_COLORS)
  }, [])

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <ServicesProvider client={apiClient}>
        <QueryClientProvider client={queryClient}>
          <LoginProvider>
            <ThemeProvider theme={theme}>
              <RouteSelector />
            </ThemeProvider>
          </LoginProvider>
        </QueryClientProvider>
      </ServicesProvider>
    </Router>
  )
}

export default App
