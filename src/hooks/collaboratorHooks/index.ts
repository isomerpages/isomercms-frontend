import { AxiosError } from "axios"
import {
  useQuery,
  useMutation,
  useQueryClient,
  UseMutationResult,
  UseQueryResult,
} from "react-query"

import {
  LIST_COLLABORATORS_KEY,
  GET_COLLABORATOR_ROLE_KEY,
} from "constants/queryKeys"

import useRedirectHook from "hooks/useRedirectHook"

import * as CollaboratorService from "services/CollaboratorService"

import { useSuccessToast, useErrorToast } from "utils/toasts"

import {
  Collaborator,
  CollaboratorError,
  CollaboratorRole,
  SiteMemberRole,
} from "types/collaborators"
import { DEFAULT_RETRY_MSG } from "utils"

export const useListCollaboratorsHook = (
  siteName: string
): UseQueryResult<Collaborator[], AxiosError<unknown>> => {
  const errorToast = useErrorToast()
  const { setRedirectToPage } = useRedirectHook()
  return useQuery(
    [LIST_COLLABORATORS_KEY, siteName],
    () =>
      CollaboratorService.listCollaborators(siteName).then((data) => {
        return data.collaborators
      }),
    {
      onError: (err) => {
        if (err?.response?.status === 403) {
          // This is to cater for the case where the user
          // deletes themselves from the site's collaborators list
          setRedirectToPage("/sites")
        } else {
          errorToast({
            description: `The list of collaborators could not be retrieved. ${DEFAULT_RETRY_MSG}`,
          })
        }
      },
    }
  )
}

export const useGetCollaboratorRoleHook = (
  siteName: string
): UseQueryResult<SiteMemberRole> => {
  const errorToast = useErrorToast()
  return useQuery(
    [GET_COLLABORATOR_ROLE_KEY, siteName],
    () =>
      CollaboratorService.getRole(siteName).then((data) => {
        return data.role
      }),
    {
      onError: () => {
        errorToast({
          description: `Your collaborator role could not be retrieved. ${DEFAULT_RETRY_MSG}`,
        })
      },
    }
  )
}

export const useDeleteCollaboratorHook = (
  siteName: string
): UseMutationResult<void, AxiosError<unknown>, string> => {
  const queryClient = useQueryClient()
  const successToast = useSuccessToast()
  const errorToast = useErrorToast()
  return useMutation(
    (collaboratorId: string) =>
      CollaboratorService.deleteCollaborator(siteName, collaboratorId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries([LIST_COLLABORATORS_KEY, siteName])
        successToast({ description: "Collaborator removed successfully" })
      },
      onError: (err) => {
        if (err?.response?.status === 422) {
          errorToast({
            description: `You can't be removed, because sites need at least one Admin`,
          })
        } else {
          errorToast({
            description: `Could not delete site member. ${DEFAULT_RETRY_MSG}`,
          })
        }
      },
    }
  )
}

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
