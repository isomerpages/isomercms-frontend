// TODO: Replace with actual model types in backend

export interface SiteModel {
  id: number
  name: string
  apiTokenName: string
  siteStatus: string // TODO: This is really a SiteStatus enum but I didn't want to replicate this in the frontend
  jobStatus: string // TODO: This is also an enum
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
  /* eslint-disable-next-line */
  site_members: Array<UserModel & { SiteMember: SiteMemberModel }>
  repo?: any // TODO: Repo
  deployment?: any // TODO: Deployment
  creatorId: number
  /* eslint-disable-next-line */
  site_creator: UserModel
}

export interface SiteMemberModel {
  userId: number
  siteId: string
  role: string
  createdAt: Date
  updatedAt: Date
}
export interface UserModel {
  id: number
  email: string | null
  githubId: string
  contactNumber: string | null
  lastLoggedIn: Date
  createdAt: Date
  updatedAt: Date
  deletedAt?: Date
  sites: Array<SiteModel & { SiteMember: SiteMemberModel }>
  sitesCreated?: SiteModel[]
}

export type CollaboratorData = {
  collaborators: Array<UserModel & { SiteMember: SiteMemberModel }>
}
export type CollaboratorRoleData = {
  role: SiteMemberModel["role"]
}

export interface CollaboratorError {
  code: number
  message: string
}
