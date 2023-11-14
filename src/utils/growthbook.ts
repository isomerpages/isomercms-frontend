import { GrowthBook, useFeatureIsOn } from "@growthbook/growthbook-react"
import { useParams } from "react-router-dom"

import { FeatureFlagsType } from "constants/featureFlags"

import { FeatureFlags } from "types/featureFlags"

const GROWTHBOOK_API_HOST = "https://cdn.growthbook.io"

export const getGrowthBookInstance = (clientKey: string) => {
  const isDev = process.env.REACT_APP_ENV === "LOCAL_DEV" // only enable for local dev

  return new GrowthBook({
    apiHost: GROWTHBOOK_API_HOST,
    clientKey,
    enableDevMode: isDev,
  })
}

export const getSiteNameAttributeFromPath = (path: string) => {
  const pathnames = path.split("/")

  if (pathnames.length > 2 && pathnames[1] === "sites") {
    return pathnames[2]
  }
  return ""
}

export const useIsIsomerFeatureOn = (
  featureName: FeatureFlagsType
): boolean => {
  const { siteName } = useParams<{ siteName: string }>()
  if (siteName === "storybook") return true

  const isFeatureEnabled = useFeatureIsOn<FeatureFlags>(featureName)
  return isFeatureEnabled
}
