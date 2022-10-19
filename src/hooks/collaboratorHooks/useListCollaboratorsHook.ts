import { AxiosError } from "axios"
import { UseQueryResult, useQuery } from "react-query"

import { LIST_COLLABORATORS_KEY } from "constants/queryKeys"

import useRedirectHook from "hooks/useRedirectHook"

import { CollaboratorService } from "services"
import { Collaborator } from "types/collaborators"
import { MiddlewareError } from "types/error"
import { useErrorToast, DEFAULT_RETRY_MSG } from "utils"

export const useListCollaboratorsHook = (
  siteName: string
): UseQueryResult<Collaborator[], AxiosError<MiddlewareError>> => {
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
