export const StatusStates = {
  pending: "PENDING",
  ready: "READY",
  error: "ERROR",
} as const
export type BuildStatus = typeof StatusStates[keyof typeof StatusStates]

export interface StagingBuildStatus {
  status: BuildStatus
}
