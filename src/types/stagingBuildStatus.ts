export const statusStates = {
  pending: "PENDING",
  ready: "READY",
  error: "ERROR",
} as const
export type buildStatus = typeof statusStates[keyof typeof statusStates]

export interface StagingBuildStatus {
  status: buildStatus
}
