import { FEATURE_FLAGS } from "constants/featureFlags"
import { RTEBlockValues } from "constants/rteBlocks"

// Example usage: const gb = useGrowthBook<FeatureFlags>();
export interface FeatureFlags {
  [FEATURE_FLAGS.REPO_PRIVATISATION]: boolean
  [FEATURE_FLAGS.BANNER]: {
    variant: "info" | "error" | "warn"
    message: string
  }
  [FEATURE_FLAGS.NPS_FORM]: boolean
  [FEATURE_FLAGS.HOMEPAGE_ENABLED_BLOCKS]: { blocks: string[] }
  [FEATURE_FLAGS.RTE_ENABLED_BLOCKS]: { blocks: RTEBlockValues[] }
  [FEATURE_FLAGS.TIPTAP_EDITOR]: boolean
  [FEATURE_FLAGS.IS_SHOW_STAGING_BUILD_STATUS_ENABLED]: boolean
  [FEATURE_FLAGS.IS_BROKEN_LINKS_REPORT_ENABLED]: boolean
}

export type GBAttributes = {
  userId: string
  userType: string
  email: string
  displayedName: string
  contactNumber: string
  siteName?: string
}
