import { slugifyCategory } from "../../src/utils"
import {
  E2E_DEFAULT_WAIT_TIME,
  E2E_EXTENDED_TIMEOUT,
  E2E_CHANGE_WAIT_TIME,
} from "../fixtures/constants"

describe("Resources page", () => {
  const CMS_BASEURL = Cypress.env("BASEURL")
  const COOKIE_NAME = Cypress.env("COOKIE_NAME")
  const COOKIE_VALUE = Cypress.env("COOKIE_VALUE")
  const TEST_REPO_NAME = Cypress.env("TEST_REPO_NAME")
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
    // Before each test, we can automatically preserve the cookie.
    // This means it will not be cleared before the NEXT test starts.
    Cypress.Cookies.preserveOnce(COOKIE_NAME)
    window.localStorage.setItem("userId", "test")
    cy.visit(
      `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/resourceRoom/${TEST_RESOURCE_ROOM_NAME}`
    )
  })

  it("Resources page should have resources header", () => {
    cy.contains("Resources")
  })

  it("Resources page should allow user to create a new resource category", () => {
    cy.wait(E2E_DEFAULT_WAIT_TIME)
    cy.contains("Create new category").click()
    cy.get("input#newDirectoryName").clear().type(TEST_CATEGORY)
    cy.contains("Next").click()

    cy.wait(E2E_CHANGE_WAIT_TIME)

    // Asserts
    // 1. Redirect to newly created folder
    cy.url().should(
      "include",
      `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/resourceRoom/${TEST_RESOURCE_ROOM_NAME}/resourceCategory/${TEST_CATEGORY_SLUGIFIED}`
    )

    // 2. If user goes back to Resources, they should be able to see that the folder exists
    cy.contains("Back to Resources").click()
    cy.contains(TEST_CATEGORY)
  })

  it("Resources page should not allow user to create a new resource category with invalid name", () => {
    cy.wait(E2E_DEFAULT_WAIT_TIME)
    cy.contains("Create new category").click()

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
    cy.wait(E2E_DEFAULT_WAIT_TIME)
    cy.contains("Create new category").click()

    cy.get("input#newDirectoryName").clear().type(TEST_CATEGORY_2)
    cy.contains("Next").click()

    // Asserts
    // 1. Redirect to newly created folder
    cy.url().should(
      "include",
      `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/resourceRoom/${TEST_RESOURCE_ROOM_NAME}/resourceCategory/${TEST_CATEGORY_2_SLUGIFIED}`
    )

    // 2. If user goes back to Resources, they should be able to see that the folder exists
    cy.contains("Back to Resources").click()
    cy.wait(E2E_DEFAULT_WAIT_TIME)
    cy.contains(TEST_CATEGORY_2)
  })

  it("Resources page should not allow user to rename a resource category using an invalid name", () => {
    cy.contains(TEST_CATEGORY_2).find("[id^=settings-folder]").click()
    cy.contains(TEST_CATEGORY_2).contains("Edit details").click()

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
    cy.wait(E2E_DEFAULT_WAIT_TIME)
    cy.contains(TEST_CATEGORY_2).find("[id^=settings-folder]").click()
    cy.contains(TEST_CATEGORY_2).contains("Edit details").click()

    cy.get("input").clear().type(TEST_CATEGORY_RENAMED)
    cy.contains("Save").click()

    // Set a wait time because the API takes time
    cy.wait(E2E_DEFAULT_WAIT_TIME)
    cy.contains("Successfully updated directory settings", {
      timeout: E2E_EXTENDED_TIMEOUT,
    }).should("exist")

    cy.contains(TEST_CATEGORY_RENAMED)
  })

  it("Resources page should allow user to navigate into a resource category", () => {
    cy.contains(TEST_CATEGORY).click()
    cy.url().should(
      "include",
      `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/resourceRoom/${TEST_RESOURCE_ROOM_NAME}/resourceCategory/${TEST_CATEGORY_SLUGIFIED}`
    )
  })

  it("Resources page should allow user to delete a resource category", () => {
    cy.contains(TEST_CATEGORY_RENAMED).find("[id^=settings-folder]").click()
    cy.contains(TEST_CATEGORY_RENAMED).contains("Delete").click()
    cy.contains(":button", "Cancel").click()

    cy.contains(TEST_CATEGORY_RENAMED).find("[id^=settings-folder]").click()
    cy.contains(TEST_CATEGORY_RENAMED).contains("Delete").click()
    cy.contains(":button", "Delete").click()

    // Set a wait time because the API takes time
    cy.wait(E2E_DEFAULT_WAIT_TIME)
    cy.contains("Successfully deleted directory")

    cy.contains(TEST_CATEGORY_RENAMED).should("not.exist")
  })
})
