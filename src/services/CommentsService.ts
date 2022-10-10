import { CommentData, CommentProps, UpdateCommentProps } from "types/comments"

import { apiService } from "./ApiService"

export const getComments = async ({
  siteName,
  requestId,
}: CommentProps): Promise<CommentData[]> => {
  const endpoint = `/sites/${siteName}/review/${requestId}/comments`
  return apiService.get(endpoint).then((res) => res.data)
}

export const updateComments = async ({
  siteName,
  requestId,
  message,
}: UpdateCommentProps): Promise<void> => {
  const endpoint = `/sites/${siteName}/review/${requestId}/comments`
  return apiService.post(endpoint, { message })
}

export const updateReadComments = async ({
  siteName,
  requestId,
}: CommentProps): Promise<void> => {
  const endpoint = `/sites/${siteName}/review/${requestId}/comments/readComments`
  return apiService.post(endpoint)
}
