import { DELETE_BUTTON_SELECTOR } from "../fixtures/selectors"

import { closeModal } from "./modal"

export const getCollaboratorsModal = (): Cypress.Chainable<
  JQuery<HTMLFormElement>
> => {
  cy.contains("Site collaborators")
    .parent()
    .parent()
    .parent()
    .within(() => cy.get("button").click())

  // NOTE: the form encloses the displayed modal component
  return cy.get("form").should("be.visible")
}

export const removeOtherCollaborators = (): void => {
  getCollaboratorsModal()
    .get(DELETE_BUTTON_SELECTOR)
    .then((buttons) => {
      if (buttons.length > 1) {
        buttons.slice(1).each((_, button) => {
          button.click()
        })
      }
    })

  closeModal()
}
