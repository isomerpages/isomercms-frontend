import { useQuery, UseQueryResult } from "react-query"

import { ALL_NOTIFICATIONS_KEY } from "constants/queryKeys"

import * as NotificationService from "services/NotificationService"

import { NotificationData } from "types/notifications"
import { DEFAULT_RETRY_MSG, useErrorToast } from "utils"

export const useGetAllNotifications = (
  siteName: string
): UseQueryResult<NotificationData[]> => {
  const errorToast = useErrorToast()
  return useQuery(
    [ALL_NOTIFICATIONS_KEY, siteName],
    () => NotificationService.getAllNotifications({ siteName }),
    {
      retry: false,
      enabled: false, // We only manually trigger this query
      onError: () => {
        errorToast({
          description: `Your notifications could not be retrieved. ${DEFAULT_RETRY_MSG}`,
        })
      },
    }
  )
}
