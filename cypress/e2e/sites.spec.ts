import {
  CMS_BASEURL,
  Interceptors,
  TEST_REPO_NAME,
} from "../fixtures/constants"

describe("Sites page", () => {
  beforeEach(() => {
    cy.setSessionDefaults()
    cy.setupDefaultInterceptors()
  })

  it("Sites page should have sites header", () => {
    cy.visit(`${CMS_BASEURL}/sites`).wait(Interceptors.GET)
    cy.contains("Get help").should("exist")
  })

  it("Sites page should allow user to click into a test site repo", () => {
    cy.visit(`${CMS_BASEURL}/sites`)
      // NOTE: `/whoami` and `/sites`
      .wait(Interceptors.GET)
      .wait(Interceptors.GET)

    cy.contains("Loading sites").should("not.exist")

    cy.contains(TEST_REPO_NAME).click()
    cy.url().should(
      "include",
      `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/workspace`
    )
  })
})
