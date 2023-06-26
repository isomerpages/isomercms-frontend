import { E2E_EMAIL_TEST_SITE } from "../fixtures/constants"
import { USER_TYPES } from "../fixtures/users"

export const addAdmin = (admin: string): void => {
  cy.createEmailUser(
    admin,
    USER_TYPES.Email.Admin,
    USER_TYPES.Email.Admin,
    E2E_EMAIL_TEST_SITE.name
  )
}
