import { AxiosError } from "axios"
import { useMutation, UseMutationResult } from "react-query"

import * as NotificationService from "services/NotificationService"

export const useUpdateReadNotifications = (): UseMutationResult<
  void,
  AxiosError,
  { siteName: string }
> => {
  return useMutation<void, AxiosError, { siteName: string }>((siteName) =>
    NotificationService.updateReadNotifications(siteName)
  )
}
