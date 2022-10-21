import { CollaboratorDto, CollaboratorRole } from "types/collaborators"

import { apiService } from "./ApiService"

const getCollaboratorEndpoint = (siteName: string): string => {
  return `/sites/${siteName}/collaborators`
}

export const getRole = async (
  siteName: string
): Promise<{ role: CollaboratorRole }> => {
  const endpoint = `${getCollaboratorEndpoint(siteName)}/role`
  return apiService.get(endpoint).then((res) => res.data)
}

export const listCollaborators = async (
  siteName: string
): Promise<{ collaborators: CollaboratorDto[] }> => {
  const endpoint = getCollaboratorEndpoint(siteName)
  return apiService
    .get<{ collaborators: CollaboratorDto[] }>(endpoint)
    .then((res) => res.data)
}

export const addCollaborator = async (
  siteName: string,
  email: string,
  isAcknowledged: boolean
): Promise<void> => {
  const endpoint = getCollaboratorEndpoint(siteName)
  return apiService
    .post(endpoint, { email, acknowledge: isAcknowledged })
    .then((res) => res.data)
}

export const deleteCollaborator = async (
  siteName: string,
  collaboratorId: string
): Promise<void> => {
  const endpoint = `${getCollaboratorEndpoint(siteName)}/${collaboratorId}`
  return apiService.delete(endpoint).then((res) => res.data)
}
