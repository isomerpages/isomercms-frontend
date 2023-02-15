import { LOCAL_STORAGE_KEYS } from "constants/localStorage"

import { useLoginContext } from "contexts/LoginContext"

import { ANNOUNCEMENTS } from "features/AnnouncementModal/Announcements"
import { Announcement } from "types/announcements"

import { useLocalStorage } from "./useLocalStorage"

interface UseAnnouncementReturn {
  announcements?: Announcement[]
  setLastSeenAnnouncement: () => void
}

export const useAnnouncement = (): UseAnnouncementReturn => {
  const { email } = useLoginContext()
  const [
    lastSeenAnnouncementsStore,
    setLastSeenAnnouncementsStore,
  ] = useLocalStorage<Record<string, number | null>>(
    LOCAL_STORAGE_KEYS.Announcements,
    {}
  )

  // TODO: determine version update strategy
  // For now, we will always show the latest version if the user has no prior record
  const lastSeenAnnouncementVersion =
    lastSeenAnnouncementsStore[email] ?? ANNOUNCEMENTS.length - 1
  // NOTE: If the user has seen all existing announcements, this will return `undefined`.
  // The caller has to check for this and not render if so.
  const announcements = ANNOUNCEMENTS.at(lastSeenAnnouncementVersion)

  return {
    announcements,
    setLastSeenAnnouncement: () => {
      lastSeenAnnouncementsStore[email] = lastSeenAnnouncementVersion + 1
      setLastSeenAnnouncementsStore(lastSeenAnnouncementsStore)
    },
  }
}
