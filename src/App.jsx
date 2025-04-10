import "@fontsource/ibm-plex-mono"
import "inter-ui/inter.css"

import { datadogRum } from "@datadog/browser-rum"
import { GrowthBookProvider } from "@growthbook/growthbook-react"
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

import { getGrowthBookInstance } from "utils/growthbook"

import theme from "theme"

import { DATADOG_RUM_SETTINGS } from "./constants/datadog"

// axios settings
axios.defaults.withCredentials = true

// Constants
const LOCAL_STORAGE_SITE_COLORS = "isomercms_colors"

// react-query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // default: true
    },
  },
})

// api client
const API_BASE_URL_V2 = `${process.env.REACT_APP_BACKEND_URL_V2}`
const apiClient = axios.create({
  baseURL: API_BASE_URL_V2,
  allowAbsoluteUrls: false,
  timeout: 100000, // 100 secs
})

// datadog env var
const {
  REACT_APP_DATADOG_APP_ID,
  REACT_APP_DATADOG_CLIENT_TOKEN,
  REACT_APP_VERSION,
  REACT_APP_ENV,
  REACT_APP_BACKEND_URL_V2,
  REACT_APP_BACKEND_URL,
} = process.env

if (REACT_APP_ENV === "staging" || REACT_APP_ENV === "production") {
  datadogRum.init({
    applicationId: REACT_APP_DATADOG_APP_ID,
    clientToken: REACT_APP_DATADOG_CLIENT_TOKEN,
    site: "datadoghq.com",
    service: "isomer",
    env: REACT_APP_ENV,
    // Specify a version number to identify the deployed version of your application in Datadog
    version: REACT_APP_VERSION,
    allowedTracingUrls: [REACT_APP_BACKEND_URL_V2, REACT_APP_BACKEND_URL],
    ...DATADOG_RUM_SETTINGS,
  })

  datadogRum.startSessionReplayRecording()
}

// GrowthBook instance
const growthbook = getGrowthBookInstance(
  process.env.REACT_APP_GROWTHBOOK_CLIENT_KEY
)

const App = () => {
  useEffect(() => {
    localStorage.removeItem(LOCAL_STORAGE_SITE_COLORS)

    // Load features from the GrowthBook API and keep them up-to-date
    growthbook.loadFeatures({ autoRefresh: true })
  }, [])

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <GrowthBookProvider growthbook={growthbook}>
        <ServicesProvider client={apiClient}>
          <QueryClientProvider client={queryClient}>
            <LoginProvider>
              <ThemeProvider theme={theme}>
                <RouteSelector />
              </ThemeProvider>
            </LoginProvider>
          </QueryClientProvider>
        </ServicesProvider>
      </GrowthBookProvider>
    </Router>
  )
}

export default App
