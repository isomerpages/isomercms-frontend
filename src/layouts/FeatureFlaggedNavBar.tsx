import { useFeatureIsOn } from "@growthbook/growthbook-react"
import { useParams } from "react-router-dom"

import { FEATURE_FLAGS } from "constants/featureFlags"

import EditNavBar from "./EditNavBar"
import LegacyEditNavBar from "./LegacyEditNavBar"

export const FeatureFlaggedNavBar = (): JSX.Element => {
  const params = useParams<{ siteName: string }>()
  const shouldShowNewStyles = useFeatureIsOn(FEATURE_FLAGS.STYLING_REVAMP)

  return shouldShowNewStyles ? (
    <EditNavBar match={{ params }} />
  ) : (
    <LegacyEditNavBar match={{ params }} />
  )
}
