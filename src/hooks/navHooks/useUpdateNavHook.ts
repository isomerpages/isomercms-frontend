import { AxiosError } from "axios"
import { UseMutationResult, useQueryClient, useMutation } from "react-query"

import { GET_NAV_KEY } from "constants/queryKeys"

import { NavService } from "services"
import { MiddlewareError } from "types/error"
import {
  NavDto,
  SinglePageNav,
  CollectionNav,
  ResourceNav,
  SubmenuNav,
} from "types/nav"
import { useSuccessToast, useErrorToast, DEFAULT_RETRY_MSG } from "utils"

export interface UpdateNavParams {
  originalNav: NavDto
  links: (SinglePageNav | CollectionNav | ResourceNav | SubmenuNav)[]
  sha: string
}

export const useUpdateNavHook = (
  siteName: string
): UseMutationResult<void, AxiosError<MiddlewareError>, UpdateNavParams> => {
  const queryClient = useQueryClient()
  const successToast = useSuccessToast()
  const errorToast = useErrorToast()
  return useMutation(
    (updateNavData: UpdateNavParams) => {
      const { originalNav, links, sha } = updateNavData
      return NavService.updateNav(siteName, {
        content: {
          ...originalNav,
          links,
        },
        sha,
      })
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries([GET_NAV_KEY, siteName])
        successToast({ description: "Navigation bar updated successfully" })
      },
      onError: (err) => {
        errorToast({
          description: `Could not update navigation bar. ${DEFAULT_RETRY_MSG}`,
        })
      },
    }
  )
}
