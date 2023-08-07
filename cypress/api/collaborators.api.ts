import { CollaboratorDto } from "../../src/types/collaborators"
import { E2E_EMAIL_ADMIN, E2E_EMAIL_TEST_SITE } from "../fixtures/constants"
import { USER_TYPES } from "../fixtures/users"

import { E2E_EMAIL_SITE_API_URL } from "./constants"

const BASE_URL = `${E2E_EMAIL_SITE_API_URL}/collaborators`

export const addAdmin = (admin: string): void => {
  cy.createEmailUser(
    admin,
    USER_TYPES.Email.Admin,
    USER_TYPES.Email.Admin,
    E2E_EMAIL_TEST_SITE.name
  )
}

export const listCollaborators = (): Cypress.Chainable<CollaboratorDto[]> => {
  return cy.request("GET", `${BASE_URL}`).then(({ body }) => body.collaborators)
}

export const removeOtherCollaborators = (): void => {
  listCollaborators().then((collaborators) => {
    collaborators.forEach((collaborator) => {
      if (collaborator.email === E2E_EMAIL_ADMIN.email) return
      const { id } = collaborator
      cy.request("DELETE", `${BASE_URL}/${id}`)
    })
  })
}
