import { UseQueryResult, useQuery } from "react-query"

import { GET_COLLABORATOR_ROLE_KEY } from "constants/queryKeys"

import { CollaboratorService } from "services"
import { SiteMemberRole } from "types/collaborators"
import { useErrorToast, DEFAULT_RETRY_MSG } from "utils"

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
