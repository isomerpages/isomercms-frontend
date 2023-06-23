import {
  BASE_SEO_LINK,
  COOKIE_NAME,
  COOKIE_VALUE,
  E2E_USER,
  LOCAL_STORAGE_USERID_KEY,
  LOCAL_STORAGE_USER_KEY,
  TEST_PRIMARY_COLOR,
  TEST_REPO_NAME,
} from "../fixtures/constants"

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
