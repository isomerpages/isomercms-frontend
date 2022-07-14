import * as Sentry from "@sentry/react"
import FallbackComponent from "components/FallbackComponent"
import { PropsWithChildren } from "react"
import { RouteProps as BaseRouteProps } from "react-router-dom"

import ProtectedRoute from "./ProtectedRoute"

type RouteProps = PropsWithChildren<{
  component: () => JSX.Element
  onClose: () => void
}> &
  BaseRouteProps

export const ProtectedRouteWithProps = ({
  children,
  ...rest
}: RouteProps): JSX.Element => {
  const routeChildren = children ?? null
  return (
    <Sentry.ErrorBoundary fallback={FallbackComponent}>
      {/* eslint-disable-next-line react/jsx-props-no-spreading */}
      <ProtectedRoute {...rest}>{routeChildren}</ProtectedRoute>
    </Sentry.ErrorBoundary>
  )
}
