import { useParams } from "react-router-dom"

import { OGP_SITES, TESTING_SITES } from "constants/sites"

import EditHomepage from "./EditHomepage"
import LegacyEditHomepage from "./LegacyEditHomepage/LegacyEditHomepage"

export const FeatureFlaggedHomepage = (): JSX.Element => {
  const params = useParams<{ siteName: string }>()
  const isOgpSite =
    OGP_SITES.includes(params.siteName) ||
    TESTING_SITES.includes(params.siteName)
  return isOgpSite ? (
    <EditHomepage match={{ params }} />
  ) : (
    <LegacyEditHomepage match={{ params }} />
  )
}
