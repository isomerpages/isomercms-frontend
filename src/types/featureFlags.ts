import { FEATURE_FLAGS } from "constants/featureFlags"

// Example usage: const gb = useGrowthBook<FeatureFlags>();
export interface FeatureFlags {
  [FEATURE_FLAGS.STYLING_REVAMP]: boolean
  [FEATURE_FLAGS.REPO_PRIVATISATION]: boolean
}

export type GBAttributes = {
  userId: string
  userType: string
  email: string
  displayedName: string
  contactNumber: string
  siteName?: string
}
