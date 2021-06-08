import React from "react"
import { Redirect, Route } from "react-router-dom"

import { LoginConsumer } from "@contexts/LoginContext"

export default function RedirectIfLoggedInRoute({
  children,
  component: WrappedComponent,
  ...rest
}) {
  return (
    <LoginConsumer>
      {({ userId }) =>
        userId ? (
          <Redirect to="/sites" />
        ) : (
          children ||
          (WrappedComponent && <Route {...rest} component={WrappedComponent} />)
        )
      }
    </LoginConsumer>
  )
}
