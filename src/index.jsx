import * as Sentry from "@sentry/react"
import { Integrations } from "@sentry/tracing"
import React from "react"
import { createRoot } from "react-dom/client"

import "styles/index.scss"
import "styles/isomer-template.scss"

import App from "App"

if (
  process.env.REACT_APP_SENTRY_ENV === "staging" ||
  process.env.REACT_APP_SENTRY_ENV === "production"
) {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [new Integrations.BrowserTracing()],

    // We recommend adjusting this value in production, or using tracesSampler
    // for finer control
    tracesSampleRate: 1.0,
  })
}
const container = document.getElementById("root")
const root = createRoot(container)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
