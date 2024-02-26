export type SiteMemberRole = "CONTRIBUTOR" | "ADMIN" | "ISOMERADMIN"

export interface CollaboratorDto {
  id: string
  email: string
  lastLoggedIn: string
  role: SiteMemberRole
}

// NOTE: Prior to data being given to the UI,
// massage over the shape so it's easier to work with
export interface Collaborator extends Omit<CollaboratorDto, "SiteMember"> {
  role: SiteMemberRole
}

export type CollaboratorData = {
  collaborators: CollaboratorDto[]
}

export type CollaboratorRole = {
  role: SiteMemberRole
}

export type AddCollaboratorDto = {
  newCollaboratorEmail: string
  isAcknowledged: boolean
}
