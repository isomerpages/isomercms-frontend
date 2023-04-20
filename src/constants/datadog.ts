export const DATADOG_RUM_SETTINGS = {
  sessionSampleRate: 100,
  sessionReplaySampleRate: 100,
  trackUserInteractions: true,
  trackResources: true,
  trackLongTasks: true,
  defaultPrivacyLevel: "mask-user-input",
  enableExperimentalFeatures: ["clickmap"],
} as const
