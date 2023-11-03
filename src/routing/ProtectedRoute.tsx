import { Box, Center, Spinner } from "@chakra-ui/react"
import { useGrowthBook } from "@growthbook/growthbook-react"
import axios from "axios"
import _ from "lodash"
import { useEffect } from "react"
import { Redirect, Route, RouteProps, useLocation } from "react-router-dom"

import { useLoginContext } from "contexts/LoginContext"

import { getDecodedParams } from "utils/decoding"
import { getSiteNameAttributeFromPath } from "utils/growthbook"

import { GBAttributes } from "types/featureFlags"

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
    console.log(growthbook?.getFeatures(), "getFeat")
    console.log(growthbook?.getAttributes(), "getAttri")
    // console.log( growthbook?.getFeatureValue(), "getFeatvalue" )
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
    return <Route {...rest}>{children}</Route>
  }

  if (displayedName && WrappedComponent) {
    return (
      <Route
        {...rest}
        render={(props) => {
          const { match } = props
          const { params } = match
          const newMatch = {
            ...match,
            decodedParams: getDecodedParams(prune(params)),
          }
          return <WrappedComponent {...rest} {...props} match={newMatch} />
        }}
      />
    )
  }

  return <Redirect to="/" />
}
