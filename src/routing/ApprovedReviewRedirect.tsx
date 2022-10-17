import { Center } from "@chakra-ui/react"
import { Spinner } from "@opengovsg/design-system-react"
import { useEffect } from "react"
import { Redirect, RouteProps, useParams } from "react-router-dom"

import { useGetReviewRequests } from "hooks/siteDashboardHooks"

import { getAxiosErrorMessage } from "utils/axios"

import { useErrorToast, useWarningToast } from "utils"

export const ApprovedReviewRedirect = ({
  children,
  ...rest
}: RouteProps): JSX.Element => {
  const { siteName } = useParams<{ siteName: string }>()
  const {
    data: reviewRequests,
    error,
    isError,
    isLoading,
  } = useGetReviewRequests(siteName)

  const errorToast = useErrorToast()
  const warningToast = useWarningToast()

  const hasApprovedReviewRequest =
    reviewRequests &&
    reviewRequests.filter((req) => req.status === "APPROVED").length > 0

  useEffect(() => {
    if (isError) {
      errorToast({
        description: getAxiosErrorMessage(error),
      })
    }
  }, [isError, error, errorToast])

  useEffect(() => {
    if (hasApprovedReviewRequest) {
      warningToast({
        description:
          "There is currently an approved review request! Please publish that first before making any changes.",
      })
    }
  }, [hasApprovedReviewRequest, warningToast])

  return isLoading || !reviewRequests ? (
    <Center w="100%" h="100vh">
      <Spinner fontSize="1.5rem" />
    </Center>
  ) : (
    <>
      {/*
       * If we fail to retrieve the list of review requests,
       * we take the conservative route and prevent the user from editing.
       */}
      {(hasApprovedReviewRequest || isError) && (
        <Redirect to={`/sites/${siteName}/dashboard`} />
      )}
      {children}
    </>
  )
}

type RouteChild = (props: Record<string, unknown>) => JSX.Element

// Helper function to ease over injecting the redirection for legacy component
export const injectApprovalRedirect = (component: RouteChild) => (
  props: Record<string, unknown>
): JSX.Element => {
  return <ApprovedReviewRedirect>{component(props)}</ApprovedReviewRedirect>
}
