import { useParams } from "react-router-dom"

import { TESTING_SITES } from "constants/sites"

import EditHomepage from "./EditHomepage"
import LegacyEditHomepage from "./LegacyEditHomepage"

export const FeatureFlaggedHomepage = (): JSX.Element => {
  const params = useParams<{ siteName: string }>()
  const isOgpSite =
    params.siteName.startsWith("ogp-") ||
    TESTING_SITES.includes(params.siteName)
  return isOgpSite ? (
    <EditHomepage match={{ params }} />
  ) : (
    <LegacyEditHomepage match={{ params }} />
  )
}
