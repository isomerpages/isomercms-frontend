import { UseQueryResult, useQuery } from "react-query"

import { DIFF_QUERY_KEY } from "constants/queryKeys"

import { EditedItemProps } from "types/reviewRequest"

import * as ReviewService from "../../services/ReviewService"

export const useDiff = (
  siteName: string
): UseQueryResult<EditedItemProps[]> => {
  return useQuery([DIFF_QUERY_KEY, siteName], () =>
    ReviewService.getDiff(siteName)
  )
}
