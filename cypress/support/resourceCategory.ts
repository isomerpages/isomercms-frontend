import { Interceptors } from "../fixtures/constants"

Cypress.Commands.add("createResourceCategory", (name: string) => {
  cy.contains("a", "Create category").should("be.visible").click()
  cy.get("input#newDirectoryName").should("be.visible").clear().type(name)
  cy.contains("Next").click().wait(Interceptors.POST)
})
