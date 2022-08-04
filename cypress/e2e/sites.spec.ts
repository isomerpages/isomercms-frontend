import { CMS_BASEURL, TEST_REPO_NAME } from "../fixtures/constants"

describe("Sites page", () => {
  beforeEach(() => {
    cy.setSessionDefaults()
    // NOTE: This is to v1 so we are redefining it here
    cy.intercept("GET", "/v1/**").as("getRequest")
  })

  it("Sites page should have sites header", () => {
    cy.visit(`${CMS_BASEURL}/sites`).wait("@getRequest")
    cy.contains("Sites")
  })

  it("Sites page should allow user to click into a test site repo", () => {
    cy.visit(`${CMS_BASEURL}/sites`).wait("@getRequest")

    cy.contains(TEST_REPO_NAME).click()
    cy.url().should(
      "include",
      `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/workspace`
    )
  })
})
