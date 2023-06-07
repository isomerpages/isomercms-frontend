import { CMS_BASEURL, E2E_EMAIL_TEST_SITE } from "../fixtures/constants"

export const visitE2eEmailTestRepo = (): void => {
  cy.visit(`${CMS_BASEURL}/sites/${E2E_EMAIL_TEST_SITE.repo}/dashboard`)
  cy.contains(E2E_EMAIL_TEST_SITE.repo).should("be.visible")
}
