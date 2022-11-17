import { AxiosError } from "axios"
import { UseQueryResult, useQuery } from "react-query"

import { GITHUB_BLOB_QUERY_KEY } from "constants/queryKeys"

import * as ReviewService from "services/ReviewService"

import { ErrorDto } from "types/error"

export const useBlob = (
  siteName: string,
  path: string,
  prNumber: number
): UseQueryResult<Record<string, string>, AxiosError<ErrorDto>> =>
  useQuery([GITHUB_BLOB_QUERY_KEY, prNumber, siteName, path], () =>
    ReviewService.getBlob(siteName, path, prNumber)
  )
