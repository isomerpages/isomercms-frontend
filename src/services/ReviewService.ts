import {
  EditedItemProps,
  ReviewRequest,
  ReviewRequestDto,
  UserDto,
} from "types/reviewRequest"

import { apiService } from "./ApiService"

export const getDiff = async (siteName: string): Promise<EditedItemProps[]> => {
  const endpoint = `/sites/${siteName}/review/compare`
  const { items } = await apiService
    .get<{ items: EditedItemProps[] }>(endpoint)
    .then(({ data }) => data)

  return items
}
export const getCollaborators = async (
  siteName: string
): Promise<UserDto[]> => {
  const endpoint = `/sites/${siteName}/collaborators`
  return apiService
    .get<{ collaborators: UserDto[] }>(endpoint)
    .then(({ data }) => data.collaborators)
}

export const createReviewRequest = async (
  siteName: string,
  reviewData: ReviewRequestDto
): Promise<number> => {
  const endpoint = `/sites/${siteName}/review/request`
  return apiService.post<number>(endpoint, reviewData).then(({ data }) => data)
}

export const getReviewRequest = async (
  siteName: string,
  reviewId: number
): Promise<ReviewRequest> => {
  const endpoint = `/sites/${siteName}/review/${reviewId}`
  return apiService
    .get<{ reviewRequest: ReviewRequest }>(endpoint)
    .then(({ data }) => data.reviewRequest)
}

export const mergeReviewRequest = async (
  siteName: string,
  prNumber: number
): Promise<void> => {
  const endpoint = `/sites/${siteName}/review/${prNumber}/merge`
  return apiService.post(endpoint)
}
