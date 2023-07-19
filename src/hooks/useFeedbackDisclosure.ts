import { useDisclosure } from "@chakra-ui/react"
import { useLocation } from "react-router-dom"

import { LOCAL_STORAGE_KEYS } from "constants/localStorage"

import { useLoginContext } from "contexts/LoginContext"

import { isEditPageUrl, isSpecialPagesUrl } from "utils/pages"

import { useLocalStorage } from "./useLocalStorage"

type LastSeenFeedbackTime = number
type UserId = string

type FeedbackStorageMappings = Record<UserId, LastSeenFeedbackTime>

const NPS_SURVEY_INTERVAL = 1814400000 as const // 3 weeks

const { REACT_APP_SHOW_NPS_FORM } = process.env

// NOTE: Wrapper to handle get/set of individual keys
const useFeedbackStorage = () => {
  const { userId } = useLoginContext()
  const [
    userMappings,
    setUserMappings,
  ] = useLocalStorage<FeedbackStorageMappings>(LOCAL_STORAGE_KEYS.Feedback, {})

  const lastSeen = userMappings[userId]
  const setLastSeen = () => {
    setUserMappings({ ...userMappings, [userId]: Date.now() })
  }
  // NOTE: `const` cast to infer types properly
  // so that it knows that the return value is a tuple
  return [lastSeen, setLastSeen] as const
}

export const useFeedbackDisclosure = () => {
  const location = useLocation<{ from?: string }>()
  // NOTE: Despite the typing from the library,
  // state is NOT guaranteed to exist.
  const from = location.state?.from ?? ""
  // NOTE: We show the feedback modal to the users iff
  // they are navigating away from the editor
  const isLeavingContentPage = isEditPageUrl(from) || isSpecialPagesUrl(from)

  const [lastSeen, setLastSeen] = useFeedbackStorage()
  // NOTE: Either this is the first time the user has ever seen the survey
  // or that the user has seen the survey but it has been more than 3 weeks.
  // Because we toggle the survey on every month, this indicates that they should
  // do the survey if the toggle is on + sufficient time has elapsed
  const isSurveyRequired =
    !lastSeen ||
    (lastSeen + NPS_SURVEY_INTERVAL < Date.now() && REACT_APP_SHOW_NPS_FORM)

  const { onOpen, onClose } = useDisclosure()

  return {
    isOpen: isLeavingContentPage && !!isSurveyRequired,
    onOpen,
    onClose: () => {
      onClose()
      setLastSeen()
    },
  }
}
