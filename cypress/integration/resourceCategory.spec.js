import "cypress-file-upload"
import { slugifyCategory, generateResourceFileName } from "../../src/utils"

const CUSTOM_TIMEOUT = 30000 // 30 seconds

describe("Resource category page", () => {
  Cypress.config("defaultCommandTimeout", 5000)

  const CMS_BASEURL = Cypress.env("BASEURL")
  const COOKIE_NAME = Cypress.env("COOKIE_NAME")
  const COOKIE_VALUE = Cypress.env("COOKIE_VALUE")
  const TEST_REPO_NAME = Cypress.env("TEST_REPO_NAME")
  Cypress.config("baseUrl", Cypress.env("BASEURL"))

  const TEST_RESOURCE_ROOM_NAME = "resources"
  const TEST_CATEGORY = "Test Page Folder"
  const TEST_CATEGORY_2 = "Another Page Folder"
  const TEST_CATEGORY_SLUGIFIED = slugifyCategory(TEST_CATEGORY)

  const TEST_PAGE_TITLE = "Resource Page"
  const TEST_PAGE_TITLE_FILE = "File Page"
  const TEST_PAGE_TITLE_RENAMED = "Renamed Page"
  const TEST_PAGE_TITLE_2 = "Another Resource"
  const TEST_PAGE_PERMALINK = "/test-permalink"
  const TEST_PAGE_PERMALINK_CHANGED = "/changed-permalink"
  const TEST_PAGE_DATE = "2021-05-17"
  const TEST_PAGE_DATE_CHANGED = "2021-01-17"
  const TEST_PAGE_DATE_PRETTIFIED = "17 May 2021"
  const TEST_PAGE_DATE_CHANGED_PRETTIFIED = "17 Jan 2021"

  const TEST_PAGE_PERMALINK_SPECIAL = "/test permalink"
  const TEST_PAGE_DATE_INVALID_FORMAT = "20210517"
  const TEST_PAGE_DATE_INVALID_DATE = "2021-05-40"

  const TEST_FILE_PATH = "files/singapore.pdf"
  const FILE_TITLE = "singapore.pdf"

  before(() => {
    cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
    window.localStorage.setItem("userId", "test")

    // Set up test resource categories
    cy.visit(`/sites/${TEST_REPO_NAME}/resourceRoom/${TEST_RESOURCE_ROOM_NAME}`)
    cy.wait(3000)
    cy.contains("Create new category").click()
    cy.get("input#newDirectoryName").clear().type(TEST_CATEGORY)
    cy.contains("Next").click()

    cy.visit(`/sites/${TEST_REPO_NAME}/resourceRoom/${TEST_RESOURCE_ROOM_NAME}`)
    cy.wait(3000)
    cy.contains("Create new category").click()
    cy.get("input#newDirectoryName").clear().type(TEST_CATEGORY_2)
    cy.contains("Next").click()
  })

  beforeEach(() => {
    // Before each test, we can automatically preserve the cookie.
    // This means it will not be cleared before the NEXT test starts.
    cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
    window.localStorage.setItem("userId", "test")
    cy.visit(
      `/sites/${TEST_REPO_NAME}/resourceRoom/${TEST_RESOURCE_ROOM_NAME}/resourceCategory/${TEST_CATEGORY_SLUGIFIED}`
    )
  })

  it("Resource category page should have name of resource category in header", () => {
    cy.contains(TEST_CATEGORY)
  })

  it("Resources category page should allow user to create a new resource page of type post", () => {
    cy.contains("Add a new page").click()

    cy.wait(2000)

    cy.get('input[id="title"]').clear().type(TEST_PAGE_TITLE)
    cy.get('input[id="permalink"]').clear().type(TEST_PAGE_PERMALINK)
    cy.get('input[id="date"]').clear().type(TEST_PAGE_DATE)
    cy.contains("Save").click()

    // Asserts
    // 1. Redirect to newly created folder
    cy.url().should(
      "include",
      `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/resourceRoom/${TEST_RESOURCE_ROOM_NAME}/resourceCategory/${TEST_CATEGORY_SLUGIFIED}/editPage/${generateResourceFileName(
        encodeURIComponent(TEST_PAGE_TITLE),
        TEST_PAGE_DATE,
        true
      )}`
    )

    // 2. If user goes back to Resources, they should be able to see that the page exists
    cy.contains(":button", TEST_CATEGORY).click()
    cy.contains(TEST_PAGE_TITLE)

    // 3. New page should be of type POST with the correct date
    cy.contains(TEST_PAGE_TITLE).contains(`${TEST_PAGE_DATE_PRETTIFIED}/POST`)
  })

  it("Resources page should not allow user to create a new resource category with invalid name", () => {
    cy.contains("Add a new page").click()
    cy.wait(2000)
    // Same name as existing file
    cy.get('input[id="title"]').clear().type(TEST_PAGE_TITLE).blur()
    cy.contains("Save").should("be.disabled")

    // Changing another field should not enable save
    cy.get('input[id="permalink"]').clear().type(TEST_PAGE_PERMALINK).blur()
    cy.contains("Save").should("be.disabled")

    // Reset to valid title
    cy.get('input[id="title"]').clear().type(`${TEST_PAGE_TITLE}1`)
    // Special character in permalink
    cy.get('input[id="permalink"]')
      .clear()
      .type(TEST_PAGE_PERMALINK_SPECIAL)
      .blur()
    cy.contains("Save").should("be.disabled")

    // Reset to valid permalink
    cy.get('input[id="permalink"]').clear().type(TEST_PAGE_PERMALINK)
    // Invalid date format
    cy.get('input[id="date"]')
      .clear()
      .type(TEST_PAGE_DATE_INVALID_FORMAT)
      .blur()
    cy.contains("Save").should("be.disabled")
    // Invalid date
    cy.get('input[id="date"]').clear().type(TEST_PAGE_DATE_INVALID_DATE).blur()
    cy.contains("Save").should("be.disabled")
  })

  it("Resources category page should allow user to create a new resource page of type post", () => {
    cy.contains("Add a new page").click()
    cy.wait(2000)

    cy.get('input[id="title"]').clear().type(TEST_PAGE_TITLE_2)
    cy.get('input[id="permalink"]').clear().type(TEST_PAGE_PERMALINK)
    cy.get('input[id="date"]').clear().type(TEST_PAGE_DATE)
    cy.contains("Save").click()

    // Asserts
    // 1. Redirect to newly created folder
    cy.url().should(
      "include",
      `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/resourceRoom/${TEST_RESOURCE_ROOM_NAME}/resourceCategory/${TEST_CATEGORY_SLUGIFIED}/editPage/${generateResourceFileName(
        encodeURIComponent(TEST_PAGE_TITLE_2),
        TEST_PAGE_DATE,
        true
      )}`
    )

    // 2. If user goes back to Resources, they should be able to see that the page exists
    cy.contains(":button", TEST_CATEGORY).click()
    cy.contains(TEST_PAGE_TITLE_2)

    // 3. New page should be of type POST with the correct date
    cy.contains(TEST_PAGE_TITLE_2).contains(`${TEST_PAGE_DATE_PRETTIFIED}/POST`)
  })

  it("Resource category page should not allow user to rename a resource page using invalid parameters", () => {
    const testPageCard = cy
      .contains(TEST_PAGE_TITLE_2, { timeout: CUSTOM_TIMEOUT })
      .should("exist")

    testPageCard
      .children()
      .within(() => cy.get("[id^=pageCard-dropdown-]").click())

    cy.get("div[id^=settings-]").first().click() // .first() is necessary because the get returns multiple elements (refer to MenuDropdown.jsx)
    cy.wait(2000)

    // Same name as existing file
    cy.get('input[id="title"]').clear().type(TEST_PAGE_TITLE).blur()
    cy.contains("Save").should("be.disabled")

    // Changing another field should not enable save
    cy.get('input[id="permalink"]')
      .clear()
      .type(`${TEST_PAGE_PERMALINK}1`)
      .blur()
    cy.contains("Save").should("be.disabled")

    // Reset to valid title
    cy.get('input[id="title"]').clear().type(TEST_PAGE_TITLE_RENAMED)
    // Special character in permalink
    cy.get('input[id="permalink"]')
      .clear()
      .type(TEST_PAGE_PERMALINK_SPECIAL)
      .blur()
    cy.contains("Save").should("be.disabled")

    // Reset to valid permalink
    cy.get('input[id="permalink"]').clear().type(TEST_PAGE_PERMALINK)
    // Invalid date format
    cy.get('input[id="date"]')
      .clear()
      .type(TEST_PAGE_DATE_INVALID_FORMAT)
      .blur()
    cy.contains("Save").should("be.disabled")
    // Invalid date
    cy.get('input[id="date"]').clear().type(TEST_PAGE_DATE_INVALID_DATE).blur()
    cy.contains("Save").should("be.disabled")
  })

  it("Resource category page should allow user to edit a resource page details", () => {
    const testPageCard = cy
      .contains(TEST_PAGE_TITLE_2, { timeout: CUSTOM_TIMEOUT })
      .should("exist")

    testPageCard
      .children()
      .within(() => cy.get("[id^=pageCard-dropdown-]").click())

    cy.get("div[id^=settings-]").first().click() // .first() is necessary because the get returns multiple elements (refer to MenuDropdown.jsx)
    cy.wait(2000)

    cy.get('input[id="title"]').clear().type(TEST_PAGE_TITLE_RENAMED)
    cy.get('input[id="permalink"]').clear().type(TEST_PAGE_PERMALINK_CHANGED)
    cy.get('input[id="date"]').clear().type(TEST_PAGE_DATE_CHANGED)
    cy.contains("Save").click()
    cy.wait(3000)

    // Asserts

    // 1. New page exists
    cy.contains(TEST_PAGE_TITLE_RENAMED)

    // 2. New page should be of type POST with the correct date
    cy.contains(TEST_PAGE_TITLE_RENAMED).contains(
      `${TEST_PAGE_DATE_CHANGED_PRETTIFIED}/POST`
    )

    // 3. Link goes to correct page
    cy.contains(TEST_PAGE_TITLE_RENAMED).click()
    cy.url().should(
      "include",
      `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/resourceRoom/${TEST_RESOURCE_ROOM_NAME}/resourceCategory/${TEST_CATEGORY_SLUGIFIED}/editPage/${generateResourceFileName(
        encodeURIComponent(TEST_PAGE_TITLE_RENAMED),
        TEST_PAGE_DATE_CHANGED,
        true
      )}`
    )
  })

  it("Resources category page should allow user to create a new resource page of type file", () => {
    cy.contains("Add a new page").click()
    cy.wait(2000)

    cy.get('input[id="title"]').clear().type(TEST_PAGE_TITLE_FILE)
    cy.get('input[id="date"]').clear().type(TEST_PAGE_DATE)
    cy.get('input[id="radio-file"]').click().blur()

    cy.contains(":button", "Select File").click()
    cy.contains(":button", "Add new file").click()

    cy.get("#file-upload").attachFile(TEST_FILE_PATH)
    cy.get("#file-name").clear().type(FILE_TITLE)
    cy.get("button")
      .contains(/^Upload$/)
      .click()
    cy.wait(2000)

    cy.contains("Save").click()
    cy.wait(3000)

    // Asserts
    // 1. Should not redirect
    cy.url().should(
      "include",
      `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/resourceRoom/${TEST_RESOURCE_ROOM_NAME}/resourceCategory/${TEST_CATEGORY_SLUGIFIED}`
    )

    // 2. New page should be of type FILE with the correct date
    cy.contains(TEST_PAGE_TITLE_FILE)
    cy.contains(`${TEST_PAGE_DATE_PRETTIFIED}/FILE`)
  })

  it("Resources category page should allow user to change an existing resource page from post to file", () => {
    const testPageCard = cy
      .contains(TEST_PAGE_TITLE_RENAMED, { timeout: CUSTOM_TIMEOUT })
      .should("exist")

    testPageCard
      .children()
      .within(() => cy.get("[id^=pageCard-dropdown-]").click())

    cy.get("div[id^=settings-]").first().click() // .first() is necessary because the get returns multiple elements (refer to MenuDropdown.jsx)
    cy.wait(2000)

    cy.get('input[id="radio-file"]').click()

    cy.contains(":button", "Select File").click()
    cy.contains(":button", "Add new file").click()

    cy.contains(FILE_TITLE).click()
    cy.contains(":button", "Select file").click()

    cy.contains("Save").click()

    // New page should be of type FILE with the correct date
    // cy.contains("Successfully updated select file").should("exist")
    cy.contains(TEST_PAGE_TITLE_RENAMED)
    cy.contains(`${TEST_PAGE_DATE_CHANGED_PRETTIFIED}/FILE`)
  })

  it("Resources category page should allow user to change an existing resource page from file to post", () => {
    const testPageCard = cy
      .contains(TEST_PAGE_TITLE_RENAMED, { timeout: CUSTOM_TIMEOUT })
      .should("exist")

    testPageCard
      .children()
      .within(() => cy.get("[id^=pageCard-dropdown-]").click())

    cy.get("div[id^=settings-]").first().click() // .first() is necessary because the get returns multiple elements (refer to MenuDropdown.jsx)
    cy.wait(2000)

    cy.get('input[id="radio-post"]').click()

    cy.contains("Save").click()
    cy.contains("Successfully updated page").should("exist")

    // New page should be of type FILE with the correct date
    cy.reload()
    cy.contains(TEST_PAGE_TITLE_RENAMED).contains(
      `${TEST_PAGE_DATE_CHANGED_PRETTIFIED}/POST`
    )
  })

  it("Resource category page should allow user to delete a page", () => {
    const testPageCard = cy
      .contains(TEST_PAGE_TITLE_RENAMED, { timeout: CUSTOM_TIMEOUT })
      .should("exist")

    testPageCard
      .children()
      .within(() => cy.get("[id^=pageCard-dropdown-]").click())

    cy.get("div[id^=delete-]").first().click() // .first() is necessary because the get returns multiple elements (refer to MenuDropdown.jsx)
    cy.contains("button", "Delete", { timeout: CUSTOM_TIMEOUT })
      .should("exist")
      .click()

    // Set a wait time because the API takes time
    cy.wait(3000)
    cy.contains("Successfully deleted file")
    cy.contains(TEST_PAGE_TITLE_RENAMED).should("not.exist")
  })
})
