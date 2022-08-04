import { slugifyCategory } from "utils"

describe("Resources page", () => {
  const CMS_BASEURL: string = Cypress.env("BASEURL")
  const COOKIE_NAME: string = Cypress.env("COOKIE_NAME")
  const COOKIE_VALUE: string = Cypress.env("COOKIE_VALUE")
  const TEST_REPO_NAME: string = Cypress.env("TEST_REPO_NAME")
  const TEST_RESOURCE_ROOM_NAME = "resources"

  const TEST_CATEGORY = "Test Folder"
  const TEST_CATEGORY_2 = "Another Folder"
  const TEST_CATEGORY_SLUGIFIED = slugifyCategory(TEST_CATEGORY)
  const TEST_CATEGORY_2_SLUGIFIED = slugifyCategory(TEST_CATEGORY_2)
  const TEST_CATEGORY_SPECIAL = "Test Folder!"
  const TEST_CATEGORY_SHORT = "T"
  const TEST_CATEGORY_RENAMED = "Renamed Folder"

  before(() => {
    cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
  })

  beforeEach(() => {
    // NOTE: Interceptors are set up for requests hitting the network
    // This is because the network round trip time might be extremely long
    // and using the inbuilt assertion for buttons might timeout (>4s)
    // even when the request is successful.
    // This waits on the request till it succeeds or timeouts (>30s).
    // Refer here for default wait times: https://docs.cypress.io/guides/references/configuration#Timeouts
    cy.intercept("POST", "/v2/**").as("saveRequest")
    cy.intercept("DELETE", "/v2/**").as("deleteRequest")

    // Before each test, we can automatically preserve the cookie.
    // This means it will not be cleared before the NEXT test starts.
    Cypress.Cookies.preserveOnce(COOKIE_NAME)
    window.localStorage.setItem("userId", "test")
    cy.visit(
      `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/resourceRoom/${TEST_RESOURCE_ROOM_NAME}`
    )
    cy.contains("Verify").should("not.exist")
  })

  it("Resources page should have resources header", () => {
    cy.contains("Resources")
  })

  it("Resources page should allow user to create a new resource category", () => {
    cy.contains("a", "Create category").click()
    cy.get("input#newDirectoryName").clear().type(TEST_CATEGORY)
    cy.contains("Next").click()

    cy.wait("@saveRequest")

    // Asserts
    // 1. Redirect to newly created folder
    cy.url().should(
      "include",
      `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/resourceRoom/${TEST_RESOURCE_ROOM_NAME}/resourceCategory/${TEST_CATEGORY_SLUGIFIED}`
    )

    // 2. If user goes back to Resources, they should be able to see that the folder exists
    cy.contains("a", "Resources").click()
    cy.contains(TEST_CATEGORY)
  })

  it("Resources page should not allow user to create a new resource category with invalid name", () => {
    cy.contains("a", "Create category").click()

    // Disabled button for special characters
    cy.get("input#newDirectoryName").clear().type(TEST_CATEGORY_SPECIAL).blur()
    cy.contains("button", "Next").should("be.disabled")

    // Disabled button for short names
    cy.get("input#newDirectoryName").clear().type(TEST_CATEGORY_SHORT).blur()
    cy.contains("button", "Next").should("be.disabled")

    // Error toast shows when duplicate folder name
    cy.get("input#newDirectoryName").clear().type(TEST_CATEGORY).blur()
    // NOTE: See #874 and #872 for more details but the duplicate check on FE now does NOT
    // account for compound names (two instances of 'test folder' will be allowed).
    // Hence, the FE check is omitted for now (we should check that button is disabled when fixed)
    // We are unable to check for toasts because cypress e2e treats non-2xx as application errors.
    // As toasts are triggered by backend responses, this bubbles up as a test failure.
  })

  it("Resources page should allow user to create another new resource category", () => {
    cy.contains("a", "Create category").click()

    cy.get("input#newDirectoryName").clear().type(TEST_CATEGORY_2)
    cy.contains("Next").click()

    cy.wait("@saveRequest")

    // Asserts
    // 1. Redirect to newly created folder
    cy.url().should(
      "include",
      `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/resourceRoom/${TEST_RESOURCE_ROOM_NAME}/resourceCategory/${TEST_CATEGORY_2_SLUGIFIED}`
    )

    // 2. If user goes back to Resources, they should be able to see that the folder exists
    cy.contains("a", "Resources").click().should("not.exist")
    cy.contains(TEST_CATEGORY_2)
  })

  it("Resources page should not allow user to rename a resource category using an invalid name", () => {
    cy.contains("button", TEST_CATEGORY_2).parent().parent().as("folderCard")
    cy.clickContextMenuItem("@folderCard", "settings")

    // Disabled button for special characters
    cy.get("input#newDirectoryName").clear().type(TEST_CATEGORY_SPECIAL).blur()
    cy.contains("button", "Save").should("be.disabled")

    // Disabled button for short names
    cy.get("input#newDirectoryName").clear().type(TEST_CATEGORY_SHORT).blur()
    cy.contains("button", "Save").should("be.disabled")

    // Error toast shows when duplicate folder name
    cy.get("input#newDirectoryName").clear().type(TEST_CATEGORY).blur()
    // NOTE: See #874 and #872 for more details but the duplicate check on FE now does NOT
    // account for compound names (two instances of 'test folder' will be allowed).
    // Hence, the FE check is omitted for now (we should check that button is disabled when fixed)
    // We are unable to check for toasts because cypress e2e treats non-2xx as application errors.
    // As toasts are triggered by backend responses, this bubbles up as a test failure.
  })

  it("Resources page should allow user to rename a resource category", () => {
    cy.contains("a", TEST_CATEGORY_2).as("folderCard")
    cy.clickContextMenuItem("@folderCard", "settings")

    cy.get("input#newDirectoryName").clear().type(TEST_CATEGORY_RENAMED)
    cy.contains("Save").click()
    cy.wait("@saveRequest")

    cy.contains("Successfully updated directory settings").should("exist")

    cy.contains(TEST_CATEGORY_RENAMED)
  })

  it("Resources page should allow user to navigate into a resource category", () => {
    cy.contains("a", TEST_CATEGORY).click()
    cy.url().should(
      "include",
      `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/resourceRoom/${TEST_RESOURCE_ROOM_NAME}/resourceCategory/${TEST_CATEGORY_SLUGIFIED}`
    )
  })

  it("Resources page should allow user to delete a resource category", () => {
    cy.contains("button", TEST_CATEGORY_RENAMED)
      .parent()
      .parent()
      .should("exist")
      .as("folderCard")
    cy.clickContextMenuItem("@folderCard", "Delete")
    cy.contains(":button", "Cancel").click()

    cy.contains("button", TEST_CATEGORY_RENAMED)
      .parent()
      .parent()
      .should("exist")
      .as("folderCard")
    cy.clickContextMenuItem("@folderCard", "Delete")
    cy.contains(":button", "delete").click()

    cy.wait("@deleteRequest")

    cy.contains("Successfully deleted directory").should("exist")

    cy.contains(TEST_CATEGORY_RENAMED).should("not.exist")
  })
})
