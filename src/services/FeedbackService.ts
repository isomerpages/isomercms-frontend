import { FeedbackDto } from "types/feedback"

import { apiService } from "./ApiService"

export const submitFeedback = (userFeedback: FeedbackDto) => {
  const endpoint = "/metrics/feedback"
  return apiService.post(endpoint, userFeedback)
}
