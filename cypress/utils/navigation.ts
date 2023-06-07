import { BACKEND_URL, E2E_EMAIL_TEST_SITE } from "../fixtures/constants"

export const visitE2eEmailTestRepo = (): void => {
  cy.visit(`${BACKEND_URL}/sites/${E2E_EMAIL_TEST_SITE.repo}/dashboard`)
  cy.contains(E2E_EMAIL_TEST_SITE.repo).should("be.visible")
}
