import { E2E_EMAIL_TEST_SITE } from "../fixtures/constants"
import {
  COMMENTS_DRAWER_BUTTON_SELECTOR,
  COMMENTS_INPUT_SELECTOR,
  SUBMIT_COMMENT_BUTTON_SELECTOR,
} from "../fixtures/selectors/dashboard"

// NOTE: This is a `div` tag styled like a `button`
export const getOpenStagingButton = (): Cypress.Chainable<
  JQuery<HTMLElement>
> => cy.contains("Open staging")

export const openReviewRequest = (): Cypress.Chainable<JQuery<HTMLElement>> => {
  return cy.get(`a[href^="/sites/${E2E_EMAIL_TEST_SITE.repo}/review/"]`).click()
}

export const openCommentsDrawer = (): Cypress.Chainable<
  JQuery<HTMLElement>
> => {
  return cy.get(COMMENTS_DRAWER_BUTTON_SELECTOR).click()
}

export const getCommentInput = (): Cypress.Chainable<JQuery<HTMLElement>> => {
  return cy.get(COMMENTS_INPUT_SELECTOR)
}

export const submitNewComment = (): Cypress.Chainable<JQuery<HTMLElement>> => {
  return cy.get(SUBMIT_COMMENT_BUTTON_SELECTOR).click()
}
