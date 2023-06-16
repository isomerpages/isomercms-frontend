import { GET_HELP_LINK_SELECTOR } from "../fixtures/selectors"

// NOTE: This is a `div` tag styled like a `button`
export const getOpenStagingButton = (): Cypress.Chainable<
  JQuery<HTMLElement>
> => cy.contains("a", "Open staging")
export const getNotificationsButton = (): Cypress.Chainable<
  JQuery<HTMLElement>
> => cy.get(GET_HELP_LINK_SELECTOR).parent().next()

export const getAvatarButton = (): Cypress.Chainable<JQuery<HTMLElement>> =>
  getNotificationsButton().next().next()
