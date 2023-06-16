import { E2E_EMAIL_TEST_SITE } from "../fixtures/constants"
import { COMMENTS_DRAWER_BUTTON_SELECTOR } from "../fixtures/selectors/dashboard"

export const openReviewRequest = (): Cypress.Chainable<JQuery<HTMLElement>> => {
  return cy.get(`a[href^="/sites/${E2E_EMAIL_TEST_SITE.repo}/review/"]`).click()
}

export const openCommentsDrawer = (): Cypress.Chainable<
  JQuery<HTMLElement>
> => {
  return cy.get(COMMENTS_DRAWER_BUTTON_SELECTOR).click()
}
