import { useParams } from "react-router-dom"

import { OGP_SITES, TESTING_SITES } from "constants/sites"

import EditContactUs from "./EditContactUs"
import LegacyEditContactUs from "./LegacyEditContactUs"

export const FeatureFlaggedContactUs = (): JSX.Element => {
  const params = useParams<{ siteName: string }>()
  const isOgpSite =
    OGP_SITES.includes(params.siteName) ||
    TESTING_SITES.includes(params.siteName)
  return isOgpSite ? (
    <EditContactUs match={{ params }} />
  ) : (
    <LegacyEditContactUs match={{ params }} />
  )
}
