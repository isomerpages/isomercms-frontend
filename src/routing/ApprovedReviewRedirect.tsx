import { Greyscale } from "components/Greyscale"
import { PropsWithChildren, useEffect } from "react"
import { Redirect, RedirectProps, useParams } from "react-router-dom"

import { useGetReviewRequests } from "hooks/siteDashboardHooks"

import { getAxiosErrorMessage } from "utils/axios"

import { useErrorToast, useWarningToast } from "utils"

export const ApprovedReviewRedirect = ({
  children,
  ...rest
}: PropsWithChildren<Omit<RedirectProps, "to">>): JSX.Element => {
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

  return (
    <Greyscale isActive={isLoading || !reviewRequests}>
      {hasApprovedReviewRequest && (
        <Redirect {...rest} to={`/sites/${siteName}/dashboard`} />
      )}
      {/*
       * If we fail to retrieve the list of review requests,
       * we take the conservative route and prevent the user from editing.
       */}
      {!hasApprovedReviewRequest && isError && (
        <Redirect {...rest} to="/sites" />
      )}
      {children}
    </Greyscale>
  )
}

type RouteChild = (props: Record<string, unknown>) => JSX.Element

// Helper function to ease over injecting the redirection for legacy component
export const injectApprovalRedirect = (component: RouteChild) => (
  props: Record<string, unknown>
): JSX.Element => {
  return <ApprovedReviewRedirect>{component(props)}</ApprovedReviewRedirect>
}
