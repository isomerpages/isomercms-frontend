import { AxiosError } from "axios"
import { UseMutationResult, useQueryClient, useMutation } from "react-query"

import {
  LIST_COLLABORATORS_KEY,
  SITE_DASHBOARD_COLLABORATORS_KEY,
} from "constants/queryKeys"

import { CollaboratorService } from "services"
import { MiddlewareError } from "types/error"
import { useSuccessToast, useErrorToast, DEFAULT_RETRY_MSG } from "utils"

export const useDeleteCollaboratorHook = (
  siteName: string
): UseMutationResult<void, AxiosError<MiddlewareError>, string> => {
  const queryClient = useQueryClient()
  const successToast = useSuccessToast()
  const errorToast = useErrorToast()
  return useMutation(
    (collaboratorId: string) =>
      CollaboratorService.deleteCollaborator(siteName, collaboratorId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([LIST_COLLABORATORS_KEY, siteName])
        queryClient.invalidateQueries([
          SITE_DASHBOARD_COLLABORATORS_KEY,
          siteName,
        ])
        successToast({
          id: "delete-collaborator-success",
          description: "Collaborator removed successfully",
        })
      },
      onError: (err) => {
        if (err?.response?.status === 422) {
          errorToast({
            id: "delete-last-collaborator-error",
            description: `You can't be removed, because sites need at least one Admin`,
          })
        } else {
          errorToast({
            id: "delete-collaborator-error",
            description: `Could not delete site member. ${DEFAULT_RETRY_MSG}`,
          })
        }
      },
    }
  )
}
