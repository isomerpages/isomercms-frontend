export type SiteMemberRole = "CONTRIBUTOR" | "ADMIN"

export interface CollaboratorDto {
  id: string
  email: string
  githubId?: string
  lastLoggedIn: string
  contactNumber?: number
  SiteMember: {
    role: SiteMemberRole
  }
}

// NOTE: Prior to data being given to the UI,
// massage over the shape so it's easier to work with
export interface Collaborator extends Omit<CollaboratorDto, "SiteMember"> {
  role: SiteMemberRole
}

export type CollaboratorData = {
  collaborators: Collaborator[]
}

export type CollaboratorRole = {
  role: SiteMemberRole
}

export interface CollaboratorError {
  code: number
  message: string
}
