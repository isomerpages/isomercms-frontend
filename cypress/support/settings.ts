Cypress.Commands.add("saveSettings", () => {
  cy.intercept("POST", "/v2/sites/e2e-test-repo/settings").as("awaitSave")
  cy.contains("button", "Save").click()
  cy.wait("@awaitSave")
})

// Reusable visit command
Cypress.Commands.add("visitLoadSettings", (siteName, sitePath) => {
  cy.intercept("GET", `/v2/sites/${siteName}/settings`).as("awaitSettings")
  cy.visit(sitePath)
  cy.wait("@awaitSettings")
})
