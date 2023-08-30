import { useFeatureIsOn } from "@growthbook/growthbook-react"
import { useParams } from "react-router-dom"

import { FEATURE_FLAGS } from "constants/featureFlags"

import EditContactUs from "./EditContactUs"
import LegacyEditContactUs from "./LegacyEditContactUs"

export const FeatureFlaggedContactUs = (): JSX.Element => {
  const params = useParams<{ siteName: string }>()
  const shouldShowNewStyles = useFeatureIsOn(FEATURE_FLAGS.STYLING_REVAMP)

  return shouldShowNewStyles ? (
    <EditContactUs match={{ params }} />
  ) : (
    <LegacyEditContactUs match={{ params }} />
  )
}
