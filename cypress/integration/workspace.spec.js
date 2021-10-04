import {
  deslugifyPage,
  deslugifyDirectory,
  generatePageFileName,
  slugifyCategory,
  pageFileNameToTitle,
} from "../../src/utils"

const CUSTOM_TIMEOUT = 30000 // 30 seconds

describe("Workspace Pages flow", () => {
  const CMS_BASEURL = Cypress.env("BASEURL")
  const COOKIE_NAME = Cypress.env("COOKIE_NAME")
  const COOKIE_VALUE = Cypress.env("COOKIE_VALUE")
  const TEST_REPO_NAME = Cypress.env("TEST_REPO_NAME")
  const TEST_PAGE_TITLE = "test title"
  const EDITED_TEST_PAGE_TITLE = "new test page"
  const TEST_PAGE_PERMALNK = "/test-permalink"
  const TEST_PAGE_FILENAME = generatePageFileName(TEST_PAGE_TITLE)
  const TEST_PAGE_CONTENT = "my test page content"
  const EDITED_TEST_PAGE_FILENAME = generatePageFileName(EDITED_TEST_PAGE_TITLE)
  // temporary variables until refactor
  const PRETTIFIED_PAGE_TITLE_IN_FOLDER_CREATION = deslugifyPage(
    TEST_PAGE_FILENAME
  )
  const PRETTIFIED_PAGE_TITLE = deslugifyPage(TEST_PAGE_FILENAME)
  const PRETTIFIED_PAGE_TITLE_V2 = pageFileNameToTitle(TEST_PAGE_FILENAME)
  const EDITED_PRETTIFIED_PAGE_TITLE = deslugifyPage(EDITED_TEST_PAGE_FILENAME)

  const TEST_FOLDER_NO_PAGES_TITLE = "test folder title no pages"
  const PARSED_TEST_FOLDER_NO_PAGES_TITLE = slugifyCategory(
    TEST_FOLDER_NO_PAGES_TITLE
  )
  const PRETTIFIED_FOLDER_NO_PAGES_TITLE = deslugifyDirectory(
    PARSED_TEST_FOLDER_NO_PAGES_TITLE
  )

  const TEST_FOLDER_WITH_PAGES_TITLE = "test folder title with pages"
  const PARSED_TEST_FOLDER_WITH_PAGES_TITLE = slugifyCategory(
    TEST_FOLDER_WITH_PAGES_TITLE
  )
  const PRETTIFIED_FOLDER_WITH_PAGES_TITLE = deslugifyDirectory(
    PARSED_TEST_FOLDER_WITH_PAGES_TITLE
  )

  const EDITED_TEST_FOLDER_WITH_PAGES_TITLE = "edited folder with pages"
  const PARSED_EDITED_TEST_FOLDER_WITH_PAGES_TITLE = slugifyCategory(
    EDITED_TEST_FOLDER_WITH_PAGES_TITLE
  )
  const PRETTIFIED_EDITED_FOLDER_WITH_PAGES_TITLE = deslugifyDirectory(
    PARSED_EDITED_TEST_FOLDER_WITH_PAGES_TITLE
  )

  describe("Create page, delete page, edit page settings in Workspace", () => {
    beforeEach(() => {
      cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
      window.localStorage.setItem("userId", "test")
      cy.visit(`${CMS_BASEURL}/sites/${TEST_REPO_NAME}/workspace`)
    })

    it("Test site workspace page should have unlinked pages section", () => {
      cy.contains("Add a new page")
    })

    it("Should be able to create a new page with valid title and permalink", () => {
      cy.get("#settings-NEW", { timeout: CUSTOM_TIMEOUT })
        .should("exist")
        .click()
      cy.get("#title").clear().type(TEST_PAGE_TITLE)
      cy.get("#permalink").clear().type(TEST_PAGE_PERMALNK)
      cy.contains("Save").click()

      // Asserts
      // 1. User should be redirected to correct EditPage
      cy.url().should(
        "include",
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/pages/${TEST_PAGE_FILENAME}`
      )
      cy.contains(PRETTIFIED_PAGE_TITLE, { timeout: CUSTOM_TIMEOUT }).should(
        "exist"
      )

      // 2. If user goes back to the workspace, they should be able to see that the page exists
      cy.contains("My Workspace", { timeout: CUSTOM_TIMEOUT })
        .should("exist")
        .click()
      cy.contains(PRETTIFIED_PAGE_TITLE, { timeout: CUSTOM_TIMEOUT }).should(
        "exist"
      )
    })

    it("Should not be able to create page with invalid title or permalink", () => {
      const SHORT_TITLE = "abc"
      const SHORT_PERMALINK = "/12"
      const INVALID_PERMALINK = "test-"

      cy.get("#settings-NEW", { timeout: CUSTOM_TIMEOUT })
        .should("exist")
        .click()

      // Page title has to be more than 4 characters long
      cy.get("#title").clear().type(SHORT_TITLE)
      cy.get("#permalink").clear().type(TEST_PAGE_PERMALNK)
      cy.contains("The title should be longer than 4 characters.")
      cy.contains("button", "Save").should("be.disabled")

      // Page title must not already exist
      cy.get("#title").clear().type(TEST_PAGE_TITLE)
      cy.contains(
        "This title is already in use. Please choose a different title."
      )
      cy.contains("button", "Save").should("be.disabled")

      // Permalink needs to be longer than 4 characters
      cy.get("#title").clear().type(EDITED_TEST_PAGE_TITLE)
      cy.get("#permalink").clear().type(SHORT_PERMALINK)
      cy.contains("The permalink should be longer than 4 characters.")
      cy.contains("button", "Save").should("be.disabled")

      // Permalink should start with a slash, and contain alphanumeric characters separated by hyphens and slashes only
      cy.get("#title").clear().type(EDITED_TEST_PAGE_TITLE)
      cy.get("#permalink").clear().type(INVALID_PERMALINK)
      cy.contains(
        "The url should start with a slash, and contain alphanumeric characters separated by hyphens and slashes only."
      )
      cy.contains("button", "Save").should("be.disabled")
    })

    it("Should be able to edit existing page details with valid title and permalink", () => {
      const testPageCard = cy
        .contains(PRETTIFIED_PAGE_TITLE, { timeout: CUSTOM_TIMEOUT })
        .should("exist")

      // User should be able edit page details
      testPageCard.children().within(() => cy.get("[id^=settings-]").click())
      cy.get("div[id^=settings-]").first().click() // .first() is necessary because the get returns multiple elements (refer to MenuDropdown.jsx)
      cy.get("#title").clear().type(EDITED_TEST_PAGE_TITLE)
      cy.contains("button", "Save").click()

      // New page title should be reflected in the Workspace
      const editedTestPageCard = cy.contains(EDITED_PRETTIFIED_PAGE_TITLE)

      // Reset the page title to previous title
      editedTestPageCard
        .children()
        .within(() => cy.get("[id^=settings-]").click())
      cy.get("div[id^=settings-]").first().click() // .first() is necessary because the get returns multiple elements (refer to MenuDropdown.jsx)
      cy.get("#title").clear().type(TEST_PAGE_TITLE)
      cy.contains("button", "Save").click()

      // Page title should be reset in the Workspace
      cy.contains(PRETTIFIED_PAGE_TITLE, { timeout: CUSTOM_TIMEOUT }).should(
        "exist"
      )
    })

    it("Should be able to delete existing page on workspace", () => {
      // Ensure that the frontend has been updated
      cy.contains(EDITED_PRETTIFIED_PAGE_TITLE, {
        timeout: CUSTOM_TIMEOUT,
      }).should("not.exist")

      // Assert
      // User should be able to remove the created test page card
      cy.contains(PRETTIFIED_PAGE_TITLE, { timeout: CUSTOM_TIMEOUT })
        .should("exist")
        .children()
        .within(() => cy.get("[id^=settings-]").click())
      cy.get("div[id^=delete-]").first().click() // .first() is necessary because the get returns multiple elements (refer to MenuDropdown.jsx)
      cy.contains("button", "Delete", { timeout: CUSTOM_TIMEOUT })
        .should("exist")
        .click()

      cy.contains(PRETTIFIED_PAGE_TITLE, { timeout: CUSTOM_TIMEOUT }).should(
        "not.exist"
      )
    })
  })

  describe("Create folder, rename folder, and delete folder from Workspace", () => {
    beforeEach(() => {
      cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
      window.localStorage.setItem("userId", "test")
      cy.visit(`${CMS_BASEURL}/sites/${TEST_REPO_NAME}/workspace`)
    })

    it("Test site workspace page should have folders section", () => {
      cy.contains("Create new folder", { timeout: CUSTOM_TIMEOUT }).should(
        "exist"
      )
    })

    // Create
    it("Should be able to create a new folder with valid folder name with no pages", () => {
      cy.contains("Create new folder", { timeout: CUSTOM_TIMEOUT })
        .should("exist")
        .click()
      cy.get("input#folder").clear().type(TEST_FOLDER_NO_PAGES_TITLE)
      cy.contains("Select pages").click()
      cy.contains("Done").click()

      // Assert
      cy.contains(PRETTIFIED_FOLDER_NO_PAGES_TITLE, {
        timeout: CUSTOM_TIMEOUT,
      }).should("exist")
      cy.url().should(
        "include",
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folders/${PARSED_TEST_FOLDER_NO_PAGES_TITLE}`
      )
      cy.contains("No pages here yet.")
    })

    it("Should be able to create a new folder with valid folder name with page", () => {
      // Create test page
      cy.get("#settings-NEW").click()
      cy.get("#title").clear().type(TEST_PAGE_TITLE)
      cy.get("#permalink").clear().type(TEST_PAGE_PERMALNK)
      cy.contains("Save").click()

      // Create test page content
      cy.get(".CodeMirror-scroll").type(TEST_PAGE_CONTENT)
      cy.contains("Save").click()
      cy.contains("Successfully saved page content", {
        timeout: CUSTOM_TIMEOUT,
      })
        .should("exist")
        .then(() =>
          cy.visit(`${CMS_BASEURL}/sites/${TEST_REPO_NAME}/workspace`)
        )

      cy.contains("Create new folder", { timeout: CUSTOM_TIMEOUT })
        .should("exist")
        .click()
      cy.get("input#folder").clear().type(TEST_FOLDER_WITH_PAGES_TITLE)
      cy.contains("Select pages").click()
      cy.contains(PRETTIFIED_PAGE_TITLE_IN_FOLDER_CREATION, {
        timeout: CUSTOM_TIMEOUT,
      })
        .should("exist")
        .click() // Select newly-created file
      cy.contains("Done").click()

      // Assert
      cy.contains(PRETTIFIED_FOLDER_WITH_PAGES_TITLE, {
        timeout: CUSTOM_TIMEOUT,
      }).should("exist")
      cy.url().should(
        "include",
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folders/${PARSED_TEST_FOLDER_WITH_PAGES_TITLE}`
      )
      cy.contains(PRETTIFIED_PAGE_TITLE_V2, { timeout: CUSTOM_TIMEOUT })
        .should("exist")
        .click()
      cy.get(".CodeMirror-scroll", { timeout: CUSTOM_TIMEOUT }).should(
        "contain",
        TEST_PAGE_CONTENT
      )
    })

    it("Should not be able to create a new folder with invalid folder name", () => {
      // Title is too short
      const INVALID_FOLDER_TITLE = "t"
      cy.contains("Create new folder", { timeout: CUSTOM_TIMEOUT })
        .should("exist")
        .click()
      cy.get("input#folder").clear().type(INVALID_FOLDER_TITLE)
      cy.contains("The page category should be longer than 2 characters.")
      cy.contains("button", "Select pages").should("be.disabled")

      // Folder exists
      cy.get("input#folder").clear().type(TEST_FOLDER_NO_PAGES_TITLE)
      cy.contains(
        "Another folder with the same name exists. Please choose a different name."
      )
      cy.contains("button", "Select pages").should("be.disabled")
    })

    it("Should be able to rename a folder", () => {
      cy.contains(PRETTIFIED_FOLDER_WITH_PAGES_TITLE, {
        timeout: CUSTOM_TIMEOUT,
      })
        .should("exist")
        .within(() => cy.get("[id^=settingsIcon]").click())
      cy.get("div[id^=settings-]").first().click()
      cy.contains("Rename Folder")
      cy.get("input#newDirectoryName")
        .clear()
        .type(EDITED_TEST_FOLDER_WITH_PAGES_TITLE)
      cy.contains("button", "Save").click()

      // Assert
      cy.contains(PRETTIFIED_EDITED_FOLDER_WITH_PAGES_TITLE, {
        timeout: CUSTOM_TIMEOUT,
      })
        .should("exist")
        .click()
      cy.contains(PRETTIFIED_EDITED_FOLDER_WITH_PAGES_TITLE, {
        timeout: CUSTOM_TIMEOUT,
      }).should("exist")
      cy.url().should(
        "include",
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folders/${PARSED_EDITED_TEST_FOLDER_WITH_PAGES_TITLE}`
      )

      cy.contains(PRETTIFIED_PAGE_TITLE_V2).click()
      cy.get(".CodeMirror-scroll").should("contain", TEST_PAGE_CONTENT)
    })

    it("Should be able to delete a folder", () => {
      cy.contains(PRETTIFIED_FOLDER_NO_PAGES_TITLE, { timeout: CUSTOM_TIMEOUT })
        .should("exist")
        .within(() => cy.get("[id^=settingsIcon]").click())
      cy.get("div[id^=delete-]").first().click()
      cy.contains("button", "Delete").click()

      cy.contains(PRETTIFIED_FOLDER_NO_PAGES_TITLE, {
        timeout: CUSTOM_TIMEOUT,
      }).should("not.exist")

      cy.contains(PRETTIFIED_EDITED_FOLDER_WITH_PAGES_TITLE).within(() =>
        cy.get("[id^=settingsIcon]").click()
      )
      cy.get("div[id^=delete-]").first().click()
      cy.contains("button", "Delete").click()

      cy.contains(PRETTIFIED_EDITED_FOLDER_WITH_PAGES_TITLE, {
        timeout: CUSTOM_TIMEOUT,
      }).should("not.exist")
    })
  })
})
