import { BiBell } from "react-icons/bi"

export const getNotificationIcon = (notificationType: string): JSX.Element => {
  switch (notificationType) {
    default:
      return <BiBell />
  }
}
