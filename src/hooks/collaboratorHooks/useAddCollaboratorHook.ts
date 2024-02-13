import { AxiosError } from "axios"
import {
  UseMutationResult,
  useQueryClient,
  useMutation,
  UseMutationOptions,
} from "react-query"

import {
  LIST_COLLABORATORS_KEY,
  SITE_DASHBOARD_COLLABORATORS_KEY,
} from "constants/queryKeys"

import { CollaboratorService } from "services"
import { AddCollaboratorDto } from "types/collaborators"
import { MiddlewareError } from "types/error"

export const useAddCollaboratorHook = (
  siteName: string,
  mutationOptions?: Omit<
    UseMutationOptions<
      void,
      AxiosError<{ error: MiddlewareError }>,
      AddCollaboratorDto
    >,
    "mutationFn" | "mutationKey"
  >
): UseMutationResult<
  void,
  AxiosError<{ error: MiddlewareError }>,
  AddCollaboratorDto
> => {
  const queryClient = useQueryClient()

  return useMutation<
    void,
    AxiosError<{ error: MiddlewareError }>,
    AddCollaboratorDto
  >(
    ({ newCollaboratorEmail, isAcknowledged }) =>
      CollaboratorService.addCollaborator(
        siteName,
        newCollaboratorEmail,
        isAcknowledged
      ),
    {
      ...mutationOptions,
      onSuccess: (data, variables, context) => {
        queryClient.invalidateQueries([LIST_COLLABORATORS_KEY, siteName])
        queryClient.invalidateQueries([
          SITE_DASHBOARD_COLLABORATORS_KEY,
          siteName,
        ])

        if (mutationOptions?.onSuccess) {
          mutationOptions.onSuccess(data, variables, context)
        }
      },
      onError: (err, variables, context) => {
        if (mutationOptions?.onError) {
          mutationOptions.onError(err, variables, context)
        }
      },
    }
  )
}
