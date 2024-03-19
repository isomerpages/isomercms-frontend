import { Box, Center, Spinner } from "@chakra-ui/react"
import { useGrowthBook } from "@growthbook/growthbook-react"
import axios from "axios"
import _, { identity } from "lodash"
import { useEffect } from "react"
import { Redirect, Route, RouteProps, useLocation } from "react-router-dom"

import { useLoginContext } from "contexts/LoginContext"

import { getDecodedParams } from "utils/decoding"
import { getSiteNameAttributeFromPath } from "utils/growthbook"

import { GBAttributes } from "types/featureFlags"

import { WithValidator } from "./types"

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
}: WithValidator<RouteProps>): JSX.Element => {
  const {
    displayedName,
    isLoading,
    userId,
    userType,
    email,
    contactNumber,
  } = useLoginContext()
  const growthbook = useGrowthBook()

  const currPath = useLocation().pathname
  const siteNameFromPath = getSiteNameAttributeFromPath(currPath)
  const { validate } = rest

  const validateParams = (
    params: Record<string, string | undefined> | undefined
  ) => {
    return _.entries(params)
      .map(([key, value]) => {
        // NOTE: There's no provided validation function
        // so we will assume it's valid
        if (!validate?.[key]) return true

        // NOTE: If the value is falsy, we will return true as there's nothing to validate
        if (!value) return true

        return validate[key](value)
      })
      .every(identity)
  }

  useEffect(() => {
    if (growthbook) {
      const gbAttributes: GBAttributes = {
        userId,
        userType,
        email,
        displayedName,
        contactNumber,
      }
      // add siteName if it exists
      if (siteNameFromPath && siteNameFromPath !== "") {
        gbAttributes.siteName = siteNameFromPath
      }
      growthbook.setAttributes(gbAttributes)
    }
  }, [
    userId,
    userType,
    email,
    displayedName,
    contactNumber,
    currPath,
    growthbook,
    siteNameFromPath,
  ])

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
    return (
      <Route {...rest}>
        {({ match }) => {
          const isValid = validateParams(match?.params)

          if (!isValid) {
            return <Redirect to="/not-found" />
          }

          return <>{children}</>
        }}
      </Route>
    )
  }

  if (displayedName && WrappedComponent) {
    return (
      <Route
        {...rest}
        render={(props) => {
          const { match } = props
          const isValid = validateParams(match?.params)

          if (!isValid) {
            return <Redirect to="/not-found" />
          }

          const newMatch = {
            ...match,
            decodedParams: getDecodedParams(prune(match.params)),
          }

          return <WrappedComponent {...rest} {...props} match={newMatch} />
        }}
      />
    )
  }

  return <Redirect to="/" />
}
