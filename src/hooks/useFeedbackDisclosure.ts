import { useDisclosure } from "@chakra-ui/react"
import { useFeatureIsOn } from "@growthbook/growthbook-react"
import { useLocation } from "react-router-dom"

import { FEATURE_FLAGS } from "constants/featureFlags"
import { LOCAL_STORAGE_KEYS } from "constants/localStorage"

import { useLoginContext } from "contexts/LoginContext"

import { isEditPageUrl, isSpecialPagesUrl } from "utils/pages"

import { FeatureFlags } from "types/featureFlags"

import { useLocalStorage } from "./useLocalStorage"

type LastSeenFeedbackTime = number
type UserId = string

type FeedbackStorageMappings = Record<UserId, LastSeenFeedbackTime>

// 1 week in ms
const NPS_SURVEY_DURATION = 7 * 24 * 60 * 60 * 1000

type UseFeedbackStorageReturn = readonly [number, () => void]

// NOTE: Wrapper to handle get/set of individual keys
const useFeedbackStorage = (): UseFeedbackStorageReturn => {
  const { displayedName } = useLoginContext()
  const [
    userMappings,
    setUserMappings,
  ] = useLocalStorage<FeedbackStorageMappings>(LOCAL_STORAGE_KEYS.Feedback, {})

  const lastSeen = userMappings[displayedName]
  const setLastSeen = () => {
    setUserMappings({ ...userMappings, [displayedName]: Date.now() })
  }
  // NOTE: `const` cast to infer types properly
  // so that it knows that the return value is a tuple
  return [lastSeen, setLastSeen] as const
}

type UseFeedbackDisclosureReturn = {
  isOpen: boolean
  onOpen: () => void
  onClose: () => void
}
export const useFeedbackDisclosure = (): UseFeedbackDisclosureReturn => {
  const location = useLocation<{ from?: string }>()
  // NOTE: Despite the typing from the library,
  // state is NOT guaranteed to exist.
  const from = location.state?.from ?? ""
  // NOTE: We show the feedback modal to the users iff
  // they are navigating away from the editor
  const isLeavingContentPage = isEditPageUrl(from) || isSpecialPagesUrl(from)
  const shouldShowNpsForm = useFeatureIsOn<FeatureFlags>(FEATURE_FLAGS.NPS_FORM)

  const [lastSeen, setLastSeen] = useFeedbackStorage()
  // NOTE: Either this is the first time the user has ever seen the survey
  // or that the user has seen the survey but it has been more a week (greater than duration of survey).
  // Because we toggle the survey on every month, this indicates that they should
  // do the survey if the toggle is on + sufficient time has elapsed
  const isSurveyRequired =
    (!lastSeen || lastSeen + NPS_SURVEY_DURATION < Date.now()) &&
    shouldShowNpsForm

  const { onOpen, onClose } = useDisclosure()

  return {
    isOpen: isLeavingContentPage && isSurveyRequired,
    onOpen,
    onClose: () => {
      onClose()
      setLastSeen()
    },
  }
}
