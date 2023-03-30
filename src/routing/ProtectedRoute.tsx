import { Box, Center, Spinner } from "@chakra-ui/react"
import axios from "axios"
import _ from "lodash"
import { Redirect, Route, RouteProps } from "react-router-dom"

import { useLoginContext } from "contexts/LoginContext"

import { getDecodedParams } from "utils/decoding"

// axios settings
axios.defaults.withCredentials = true

const prune = <T,>(col: Record<string, T | undefined>): Record<string, T> => {
  // NOTE: This is a safe cast; see here: https://lodash.com/docs/4.17.15#pickBy
  // `pickBy` uses `identity` by default, which omits falsy values.
  return _.pickBy(col) as Record<string, T>
}

export const ProtectedRoute = ({
  children,
  component: WrappedComponent,
  ...rest
}: RouteProps): JSX.Element => {
  const { displayedName, isLoading } = useLoginContext()

  if (isLoading) {
    return (
      <Box h="100vh" w="100vw">
        <Center h="100%" w="100%">
          <Spinner size="lg" />
        </Center>
      </Box>
    )
  }

  if (displayedName && children) {
    return <Route {...rest}>{children}</Route>
  }

  if (displayedName && WrappedComponent) {
    return (
      <Route
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...rest}
        render={(props) => {
          const { match } = props
          const { params } = match
          const newMatch = {
            ...match,
            decodedParams: getDecodedParams(prune(params)),
          }
          return (
            // eslint-disable-next-line react/jsx-props-no-spreading
            <WrappedComponent {...rest} {...props} match={newMatch} />
          )
        }}
      />
    )
  }

  return <Redirect to="/" />
}
