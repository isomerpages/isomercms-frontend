// Example usage: const gb = useGrowthBook<FeatureFlags>();
export interface FeatureFlags {
  sampleFlag: string
  sampleFlag2: string
}

export type GBAttributes = {
  userId: string
  userType: string
  email: string
  displayedName: string
  contactNumber: string
  siteName?: string
}
