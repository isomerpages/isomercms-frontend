import { useParams } from "react-router-dom"

import { OGP_SITES, TESTING_SITES } from "constants/sites"

import EditNavBar from "./EditNavBar"
import LegacyEditNavBar from "./LegacyEditNavBar"

export const FeatureFlaggedNavBar = (): JSX.Element => {
  const params = useParams<{ siteName: string }>()
  const isOgpSite =
    OGP_SITES.includes(params.siteName) ||
    TESTING_SITES.includes(params.siteName)
  return isOgpSite ? (
    <EditNavBar match={{ params }} />
  ) : (
    <LegacyEditNavBar match={{ params }} />
  )
}
