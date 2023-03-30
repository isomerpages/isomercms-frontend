import {
  EditedItemProps,
  ReviewRequest,
  CreateReviewRequestDto,
  UpdateReviewRequestDto,
} from "types/reviewRequest"

import { apiService } from "./ApiService"

export const unapproveReviewRequest = async (
  siteName: string,
  prNumber: number
): Promise<void> => {
  const endpoint = `/sites/${siteName}/review/${prNumber}/approve`
  await apiService.delete(endpoint)
}

export const getDiff = async (siteName: string): Promise<EditedItemProps[]> => {
  const endpoint = `/sites/${siteName}/review/compare`
  const { items } = await apiService
    .get<{ items: EditedItemProps[] }>(endpoint)
    .then(({ data }) => data)

  return items
}

export const createReviewRequest = async (
  siteName: string,
  reviewData: CreateReviewRequestDto
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

export const approveReviewRequest = async (
  siteName: string,
  prNumber: number
): Promise<void> => {
  const endpoint = `/sites/${siteName}/review/${prNumber}/approve`
  return apiService.post(endpoint)
}

export const cancelReviewRequest = async (
  siteName: string,
  prNumber: number
): Promise<void> => {
  const endpoint = `/sites/${siteName}/review/${prNumber}`
  return apiService.delete(endpoint)
}

export const updateReviewRequestViewed = async (
  siteName: string,
  prNumber: number
): Promise<void> => {
  const endpoint = `/sites/${siteName}/review/${prNumber}/viewed`
  return apiService.post(endpoint)
}

export const getSiteUrl = async (siteName: string): Promise<string> => {
  const endpoint = `/sites/${siteName}/siteUrl`
  return apiService
    .get<{ siteUrl: string }>(endpoint)
    .then(({ data }) => data.siteUrl)
}

export const updateReviewRequest = async (
  siteName: string,
  prNumber: number,
  updatedReviewRequestInfo: UpdateReviewRequestDto
): Promise<void> => {
  const endpoint = `/sites/${siteName}/review/${prNumber}`
  return apiService.post(endpoint, updatedReviewRequestInfo)
}
