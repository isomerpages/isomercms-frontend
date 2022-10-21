import { AxiosError } from "axios"
import { UseMutationResult, useQueryClient, useMutation } from "react-query"

import { LIST_COLLABORATORS_KEY } from "constants/queryKeys"

import { CollaboratorService } from "services"
import { MiddlewareError } from "types/error"

export const useAddCollaboratorHook = (
  siteName: string
): UseMutationResult<
  void,
  AxiosError<{ error: MiddlewareError }>,
  { newCollaboratorEmail: string; isAcknowledged: boolean }
> => {
  const queryClient = useQueryClient()
  return useMutation(
    ({ newCollaboratorEmail, isAcknowledged }) =>
      CollaboratorService.addCollaborator(
        siteName,
        newCollaboratorEmail,
        isAcknowledged
      ),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([LIST_COLLABORATORS_KEY, siteName])
      },
    }
  )
}
