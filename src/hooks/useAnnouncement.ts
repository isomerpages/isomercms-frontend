import { LOCAL_STORAGE_KEYS } from "constants/localStorage"

import { useLoginContext } from "contexts/LoginContext"

import { ANNOUNCEMENT_BATCH } from "features/AnnouncementModal/Announcements"
import { AnnouncementBatch } from "types/announcements"

import { useLocalStorage } from "./useLocalStorage"

interface UseAnnouncementsReturn extends AnnouncementBatch {
  setLastSeenAnnouncement: () => void
}

export const useAnnouncements = (): UseAnnouncementsReturn => {
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
    lastSeenAnnouncementsStore[email] ?? ANNOUNCEMENT_BATCH.length - 1
  // NOTE: If the user has seen all existing announcements, this will return `undefined`.
  // The caller has to check for this and not render if so.
  const possibleAnnouncements = ANNOUNCEMENT_BATCH.at(
    lastSeenAnnouncementVersion
  )

  return {
    announcements: possibleAnnouncements?.announcements || [],
    setLastSeenAnnouncement: () => {
      lastSeenAnnouncementsStore[email] = lastSeenAnnouncementVersion + 1
      setLastSeenAnnouncementsStore(lastSeenAnnouncementsStore)
    },
    link: possibleAnnouncements?.link || "",
  }
}
