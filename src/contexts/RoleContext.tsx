import { createContext, useContext, PropsWithChildren } from "react"
import { useParams } from "react-router-dom"

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

export const RoleProvider = ({
  children,
}: PropsWithChildren<Record<string, never>>): JSX.Element => {
  const { siteName, reviewId } = useParams<{
    siteName: string
    reviewId: string
  }>()
  const { isLoading, role } = useGetRole(siteName, reviewId)
  return (
    <RoleContext.Provider value={{ role, isLoading }}>
      {children}
    </RoleContext.Provider>
  )
}

const useGetRole = (
  siteName: string,
  reviewId: string
): {
  isLoading?: boolean
  role: RoleContextProps["role"]
} => {
  return {
    isLoading: false,
    role: "reviewer",
  }
}
