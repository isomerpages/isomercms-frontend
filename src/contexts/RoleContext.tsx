import { createContext, useContext, PropsWithChildren } from "react"
import { useParams } from "react-router-dom"

import { useGetReviewRequest } from "hooks/reviewHooks"

import { useLoginContext } from "./LoginContext"

interface RoleContextProps {
  role: "reviewer" | "requestor" | "collaborator"
  isLoading?: boolean
}

const RoleContext = createContext<null | RoleContextProps>(null)

export const useRoleContext = (): RoleContextProps => {
  const RoleContextData = useContext(RoleContext)
  if (!RoleContextData)
    throw new Error("useRoleContext must be used within an RoleProvider")

  return RoleContextData
}

const getRole = (
  email: string,
  requestor?: string,
  reviewers?: string[]
): RoleContextProps["role"] => {
  if (requestor === email) {
    return "requestor"
  }

  if (reviewers?.includes(email)) {
    return "reviewer"
  }

  return "collaborator"
}

export const RoleProvider = ({
  children,
}: PropsWithChildren<Record<string, never>>): JSX.Element => {
  const { siteName, reviewId } = useParams<{
    siteName: string
    reviewId: string
  }>()
  const { email } = useLoginContext()
  const prNumber = parseInt(reviewId, 10)
  const { data, isLoading } = useGetReviewRequest(siteName, prNumber)
  const role = getRole(email, data?.requestor, data?.reviewers)
  return (
    <RoleContext.Provider
      value={{
        role,
        isLoading,
      }}
    >
      {children}
    </RoleContext.Provider>
  )
}
