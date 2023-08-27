export const FeatureFlagSupportedTypes = {
  boolean: "boolean",
  number: "number",
  string: "string",
  json: "json",
} as const

export type FeatureFlagTypes = typeof FeatureFlagSupportedTypes[keyof typeof FeatureFlagSupportedTypes]

export type FeatureFlag = {
  key: string
  type: FeatureFlagTypes
}

export type GBAttributes = {
  userId: string
  userType: string
  email: string
  displayedName: string
  contactNumber: string
  siteName?: string
}
