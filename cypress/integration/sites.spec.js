import { describe, before } from "@jest/globals"

describe("Sites page", () => {
  const CMS_BASEURL = Cypress.env("BASEURL")
  const COOKIE_NAME = Cypress.env("COOKIE_NAME")
  const COOKIE_VALUE = Cypress.env("COOKIE_VALUE")
  const TEST_REPO_NAME = Cypress.env("TEST_REPO_NAME")

  before(() => {
    cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
  })

  beforeEach(() => {
    // Before each test, we can automatically preserve the cookie.
    // This means it will not be cleared before the NEXT test starts.
    Cypress.Cookies.preserveOnce(COOKIE_NAME)
  })

  it("Sites page should have sites header", () => {
    cy.visit(`${CMS_BASEURL}/sites`)
    cy.contains("Sites")
  })

  it("Sites page should allow user to click into a test site repo", () => {
    cy.visit(`${CMS_BASEURL}/sites`)

    // Set a wait time because the API takes time
    cy.wait(3000)
    cy.contains(TEST_REPO_NAME).click()
    cy.url().should(
      "include",
      `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/workspace`
    )
  })
})
