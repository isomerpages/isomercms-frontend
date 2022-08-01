import axios from "axios"
import { Redirect, Route } from "react-router-dom"

import { useLoginContext } from "contexts/LoginContext"

import { getDecodedParams } from "utils/decoding"

// Import contexts

// axios settings
axios.defaults.withCredentials = true

const ProtectedRoute = ({ children, component: WrappedComponent, ...rest }) => {
  const { userId, email } = useLoginContext()
  return userId || email ? (
    children ||
      (WrappedComponent && (
        <Route
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...rest}
          render={(props) => {
            const { match } = props
            const { params } = match
            const newMatch = {
              ...match,
              decodedParams: getDecodedParams(params),
            }
            return (
              // eslint-disable-next-line react/jsx-props-no-spreading
              <WrappedComponent {...rest} {...props} match={newMatch} />
            )
          }}
        />
      ))
  ) : (
    <Redirect to="/" />
  )
}

export default ProtectedRoute
