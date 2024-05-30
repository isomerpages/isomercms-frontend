import { RumInitConfiguration } from "@datadog/browser-rum"

export const DATADOG_RUM_SETTINGS: Omit<
  RumInitConfiguration,
  "applicationId" | "clientToken"
> = {
  sessionSampleRate: 100,
  sessionReplaySampleRate: 100,
  trackUserInteractions: true,
  trackResources: true,
  trackLongTasks: true,
  defaultPrivacyLevel: "mask-user-input",
  enableExperimentalFeatures: ["clickmap"],
}
