import { useGetReviewRequests } from "hooks/siteDashboardHooks"

export const isWriteActionsDisabled = (siteName: string) => {
  const { data: reviewRequests, isLoading, isError } = useGetReviewRequests(
    siteName
  )

  // Note: if PR is in APPROVED status, it will auto-redirect to dashboard as no edits should happen
  // But have added here to be explicit of the status checks
  const isReviewRequestPending = reviewRequests?.some(
    (request) => request.status === "OPEN" || request.status === "APPROVED"
  )

  return isLoading || isError || isReviewRequestPending
}
