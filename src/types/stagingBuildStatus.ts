export const statusStates = {
  unSaved: "UNSAVED",
  pending: "PENDING",
  ready: "READY",
  error: "ERROR",
} as const
export type buildStatus = typeof statusStates[keyof typeof statusStates]

export interface StagingBuildStatus {
  commit: string
  status: buildStatus
  timeLastSaved: number
}
