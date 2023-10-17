import { AxiosError } from "axios"
import { useMutation, UseMutationResult, useQueryClient } from "react-query"

import {
  DIR_CONTENT_KEY,
  NAVIGATION_CONTENT_KEY,
  RESOURCE_ROOM_NAME_KEY,
} from "constants/queryKeys"

import { NavService } from "services"
import { MiddlewareError } from "types/error"
import {
  CollectionNav,
  NavDto,
  ResourceNav,
  SinglePageNav,
  SubmenuNav,
} from "types/nav"
import { DEFAULT_RETRY_MSG, useErrorToast, useSuccessToast } from "utils"

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
        queryClient.invalidateQueries([NAVIGATION_CONTENT_KEY, siteName])
        queryClient.invalidateQueries([DIR_CONTENT_KEY, { siteName }])
        queryClient.invalidateQueries([RESOURCE_ROOM_NAME_KEY, { siteName }])
        successToast({
          id: "update-nav-success",
          description: "Navigation bar updated successfully",
        })
      },
      onError: (err: AxiosError) => {
        errorToast({
          id: "update-nav-error",
          description: `Could not update navigation bar. ${DEFAULT_RETRY_MSG}. Error: ${err.response?.data.error.message}`,
        })
      },
    }
  )
}
