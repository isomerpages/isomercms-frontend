import React from "react"
import { Redirect, Route } from "react-router-dom"
import axios from "axios"

// Import contexts
import { LoginConsumer } from "../contexts/LoginContext"

// axios settings
axios.defaults.withCredentials = true

const ProtectedRoute = ({ children, component: WrappedComponent, ...rest }) => {
  return (
    <LoginConsumer>
      {({ userId }) =>
        userId ? (
          children ||
          (WrappedComponent && (
            <Route
              {...rest}
              render={(props) => <WrappedComponent {...rest} {...props} />}
            />
          ))
        ) : (
          <Redirect to="/" />
        )
      }
    </LoginConsumer>
  )
}

export default ProtectedRoute
