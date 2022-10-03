import { BiBell } from "react-icons/bi"

export const getAvatarName = (name: string): string => {
  // Chakra Avatar uses the initials of the first 2 words in the name
  // To have the avatar show the first 2 letters instead, we artificially introduce a space
  const processedName = name.replace(/^@/, "") // Remove @ from front of string for github users
  return `${processedName.slice(0, 1)} ${processedName.slice(1)}`
}

export const getNotificationIcon = (notificationType: string): JSX.Element => {
  switch (notificationType) {
    default:
      return <BiBell />
  }
}
