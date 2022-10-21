import { createContext, useContext, PropsWithChildren } from "react"
import { useParams } from "react-router-dom"

import { useGetReviewRequest } from "hooks/reviewHooks"

import { useLoginContext } from "./LoginContext"

interface ReviewRequestRoleContextProps {
  role: "reviewer" | "requestor" | "collaborator"
  isLoading?: boolean
}

const ReviewRequestRoleContext = createContext<null | ReviewRequestRoleContextProps>(
  null
)

export const useReviewRequestRoleContext = (): ReviewRequestRoleContextProps => {
  const RoleContextData = useContext(ReviewRequestRoleContext)
  if (!RoleContextData)
    throw new Error("useRoleContext must be used within an RoleProvider")

  return RoleContextData
}

const getReviewRequestRole = (
  email: string,
  requestor?: string,
  reviewers?: string[]
): ReviewRequestRoleContextProps["role"] => {
  if (requestor === email) {
    return "requestor"
  }

  if (reviewers?.includes(email)) {
    return "reviewer"
  }

  return "collaborator"
}

export const ReviewRequestRoleProvider = ({
  children,
}: PropsWithChildren<Record<string, never>>): JSX.Element => {
  const { siteName, reviewId } = useParams<{
    siteName: string
    reviewId: string
  }>()
  const { email } = useLoginContext()
  const prNumber = parseInt(reviewId, 10)
  const { data, isLoading } = useGetReviewRequest(siteName, prNumber)
  const role = getReviewRequestRole(email, data?.requestor, data?.reviewers)
  return (
    <ReviewRequestRoleContext.Provider
      value={{
        role,
        isLoading,
      }}
    >
      {children}
    </ReviewRequestRoleContext.Provider>
  )
}
