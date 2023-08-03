import { AxiosError } from "axios"
import { useMutation, UseMutationResult } from "react-query"

import * as FeedbackService from "services/FeedbackService"

import { FeedbackDto } from "types/feedback"
import { useSuccessToast } from "utils"

export const useSubmitFeedback = (): UseMutationResult<
  void,
  AxiosError,
  FeedbackDto
> => {
  const successToast = useSuccessToast()
  return useMutation<void, AxiosError, FeedbackDto>(
    async (userFeedback) => {
      FeedbackService.submitFeedback(userFeedback)
    },
    {
      onSuccess: () => {
        successToast({
          id: "submit-feedback-success",
          description: "Thanks for your feedback!",
        })
      },
    }
  )
}
