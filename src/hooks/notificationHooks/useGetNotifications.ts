import { useQuery, UseQueryResult } from "react-query"

import { NOTIFICATIONS_KEY } from "constants/queryKeys"

import * as NotificationService from "services/NotificationService"

import { NotificationData } from "types/notifications"
import { DEFAULT_RETRY_MSG, useErrorToast } from "utils"

export const useGetNotifications = (
  siteName: string
): UseQueryResult<NotificationData[]> => {
  const errorToast = useErrorToast()
  return useQuery(
    [NOTIFICATIONS_KEY, siteName],
    () => NotificationService.getNotifications({ siteName }),
    {
      retry: false,
      enabled: false, // Manually triggered
      onError: () => {
        errorToast({
          description: `Your notifications could not be retrieved. ${DEFAULT_RETRY_MSG}`,
        })
      },
    }
  )
}
