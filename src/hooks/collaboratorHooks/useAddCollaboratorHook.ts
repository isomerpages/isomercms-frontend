import { AxiosError } from "axios"
import { UseMutationResult, useQueryClient, useMutation } from "react-query"

import { LIST_COLLABORATORS_KEY } from "constants/queryKeys"

import { CollaboratorService } from "services"
import { CollaboratorError } from "types/collaborators"

export const useAddCollaboratorHook = (
  siteName: string
): UseMutationResult<
  void,
  AxiosError<{ error: CollaboratorError }>,
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
