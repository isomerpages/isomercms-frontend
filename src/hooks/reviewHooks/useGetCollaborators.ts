import { UseQueryResult, useQuery } from "react-query"

import { COLLABORATORS_QUERY_KEY } from "constants/queryKeys"

import { UserDto } from "types/reviewRequest"

import * as ReviewService from "../../services/ReviewService"

export const useGetCollaborators = (
  siteName: string
): UseQueryResult<UserDto[]> => {
  return useQuery([COLLABORATORS_QUERY_KEY, siteName], () =>
    ReviewService.getCollaborators(siteName)
  )
}
