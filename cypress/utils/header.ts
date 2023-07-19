import { GET_HELP_LINK_SELECTOR } from "../fixtures/selectors"

export const getNotificationsButton = (): Cypress.Chainable<
  JQuery<HTMLElement>
> => cy.get(GET_HELP_LINK_SELECTOR).parent().next()

export const getAvatarButton = (): Cypress.Chainable<JQuery<HTMLElement>> =>
  getNotificationsButton().next().next()
