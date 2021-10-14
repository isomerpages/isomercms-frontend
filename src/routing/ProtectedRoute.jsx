import React from "react"
import { Redirect, Route } from "react-router-dom"
import axios from "axios"
import { getDecodedParams } from "../utils"

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
              render={(props) => {
                const { match } = props
                const { params } = match
                const newMatch = {
                  ...match,
                  decodedParams: getDecodedParams(params),
                }
                return (
                  <WrappedComponent {...rest} {...props} match={newMatch} />
                )
              }}
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
