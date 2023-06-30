import * as Sentry from "@sentry/react"
import FallbackComponent from "components/FallbackComponent"
import { RouteProps as BaseRouteProps } from "react-router-dom"

import { ProtectedRoute } from "./ProtectedRoute"

type RouteProps = {
  component?: () => JSX.Element
  onClose: () => void
} & BaseRouteProps

export const ProtectedRouteWithProps = (props: RouteProps): JSX.Element => {
  return (
    <Sentry.ErrorBoundary fallback={FallbackComponent}>
      <ProtectedRoute {...props} />
    </Sentry.ErrorBoundary>
  )
}
