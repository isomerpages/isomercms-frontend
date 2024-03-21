import {
  BASE_SEO_LINK,
  TEST_PRIMARY_COLOR,
  TEST_REPO_NAME,
} from "../fixtures/constants"

Cypress.Commands.add("saveSettings", () => {
  cy.intercept("POST", `/v2/sites/${TEST_REPO_NAME}/settings`).as("awaitSave")
  // cy.intercept("POST", `/v2/sites/${TEST_REPO_NAME}/settings/repo-password`).as(
  //   "awaitSavePassword"
  // )
  cy.contains("button", "Save").click()
  cy.wait("@awaitSave")
  // cy.wait(["@awaitSavePassword", "@awaitSave"], {
  //   timeout: 10000,
  //   requestTimeout: 10000,
  // })
})

// Reusable visit command
Cypress.Commands.add("visitLoadSettings", (siteName, sitePath) => {
  cy.intercept("GET", `/v2/sites/${siteName}/settings`).as("awaitSettings")
  // cy.intercept("GET", `/v2/sites/${siteName}/settings/repo-password`).as(
  //   "awaitPassword"
  // )
  cy.visit(sitePath)
  cy.wait("@awaitSave")
  // cy.wait(["@awaitPassword", "@awaitSettings"], {
  //   timeout: 10000,
  //   requestTimeout: 10000,
  // })
})

Cypress.Commands.add("setDefaultSettings", () => {
  cy.setGithubSessionDefaults()

  cy.visit(`/sites/${TEST_REPO_NAME}/settings`)
  cy.get("button[aria-label='Select colour']").first().click()
  cy.contains(/^r/).siblings().clear().type(TEST_PRIMARY_COLOR[0].toString())

  cy.contains(/^g/).siblings().clear().type(TEST_PRIMARY_COLOR[1].toString())

  cy.contains(/^b/).siblings().clear().type(TEST_PRIMARY_COLOR[2].toString())

  cy.contains("button", "Select").click()

  cy.contains("label", "SEO")
    .parent()
    .parent()
    .find("input")
    .clear()
    .type(BASE_SEO_LINK)

  cy.saveSettings()
})
