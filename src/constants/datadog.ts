export const DATADOG_RUM_SETTINGS = {
  sessionSampleRate: 100,
  sessionReplaySampleRate: 20,
  trackUserInteractions: true,
  trackResources: true,
  trackLongTasks: true,
  defaultPrivacyLevel: "mask-user-input",
  enableExperimentalFeatures: ["clickmap"],
} as const
