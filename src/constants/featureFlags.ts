import { FeatureFlag, FeatureFlagSupportedTypes } from "types/featureFlags"

// List of all FE feature flags corresponding to GrowthBook
// TODO: Add after setting up on GrowthBook
export const featureFlags: Record<string, FeatureFlag> = {
  sampleFeature: {
    key: "sampleFeature",
    type: FeatureFlagSupportedTypes.string,
  },
}
