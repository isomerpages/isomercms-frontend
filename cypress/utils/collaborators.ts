import { Interceptors } from "../fixtures/constants"
import {
  ADD_COLLABORATOR_INPUT_SELECTOR,
  DELETE_BUTTON_SELECTOR,
} from "../fixtures/selectors"
import { USER_TYPES } from "../fixtures/users"

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
          cy.contains("button", "Remove collaborator").click()
          cy.contains("Collaborator removed successfully").should("be.visible")
        })
      }
    })

  closeModal()
}

export const inputCollaborators = (user: string): void => {
  getCollaboratorsModal().get(ADD_COLLABORATOR_INPUT_SELECTOR).type(user).blur()
  // NOTE: need to ignore the 422 w/ specific error message because we haven't ack yet
  cy.contains("Add collaborator").click().wait(Interceptors.POST)
}

export const addCollaborator = (collaborator: string): void => {
  cy.createEmailUser(
    collaborator,
    USER_TYPES.Email.Collaborator,
    USER_TYPES.Email.Admin
  )

  inputCollaborators(collaborator)

  cy.get("input[name='isAcknowledged']").next().click()
  cy.contains("Continue").click().wait(Interceptors.POST)
  cy.on("uncaught:exception", (err) => !err.message.includes("422"))

  closeModal()
}
