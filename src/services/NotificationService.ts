import { NotificationData } from "types/notifications"

import { apiService } from "./ApiService"

export const getNotifications = async ({
  siteName,
}: {
  siteName: string
}): Promise<NotificationData[]> => {
  const endpoint = `/sites/${siteName}/notifications`
  return apiService.get(endpoint).then((res) => res.data)
}

export const getAllNotifications = async ({
  siteName,
}: {
  siteName: string
}): Promise<NotificationData[]> => {
  const endpoint = `/sites/${siteName}/notifications/allNotifications`
  return apiService.get(endpoint).then((res) => res.data)
}

export const updateReadNotifications = async ({
  siteName,
}: {
  siteName: string
}): Promise<void> => {
  const endpoint = `/sites/${siteName}/notifications`
  return apiService.post(endpoint)
}
