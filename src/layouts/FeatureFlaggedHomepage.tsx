import { useFeatureIsOn } from "@growthbook/growthbook-react"
import { useParams } from "react-router-dom"

import { FEATURE_FLAGS } from "constants/featureFlags"

import { FeatureFlags } from "types/featureFlags"

import EditHomepage from "./EditHomepage"
import LegacyEditHomepage from "./LegacyEditHomepage/LegacyEditHomepage"

export const FeatureFlaggedHomepage = (): JSX.Element => {
  const params = useParams<{ siteName: string }>()
  const shouldShowNewStyles = useFeatureIsOn<FeatureFlags>(
    FEATURE_FLAGS.STYLING_REVAMP
  )

  return shouldShowNewStyles ? (
    <EditHomepage match={{ params }} />
  ) : (
    <LegacyEditHomepage match={{ params }} />
  )
}
