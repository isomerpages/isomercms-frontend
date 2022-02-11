import {
  deslugifyDirectory,
  slugifyCategory,
  titleToPageFileName,
} from "../../src/utils"
import {
  E2E_DEFAULT_WAIT_TIME,
  E2E_EXTENDED_TIMEOUT,
} from "../fixtures/constants"

describe("Workspace Pages flow", () => {
  const CMS_BASEURL = Cypress.env("BASEURL")
  const COOKIE_NAME = Cypress.env("COOKIE_NAME")
  const COOKIE_VALUE = Cypress.env("COOKIE_VALUE")
  const TEST_REPO_NAME = Cypress.env("TEST_REPO_NAME")
  const TEST_PAGE_PERMALNK = "/test-permalink"

  const TEST_PAGE_TITLE = "test title"
  const TEST_PAGE_FILENAME = titleToPageFileName(TEST_PAGE_TITLE)
  const TEST_PAGE_ENCODED = encodeURIComponent(TEST_PAGE_FILENAME)
  const TEST_PAGE_CONTENT = "my test page content"

  const EDITED_TEST_PAGE_TITLE = "把我如到價小岸發"

  const EDITED_TEST_PAGE_TITLE_2 = "லோரம் இப்சம்"

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
      cy.get("#settings-NEW", { timeout: E2E_EXTENDED_TIMEOUT })
        .should("exist")
        .click()
      cy.get("#title").clear().type(TEST_PAGE_TITLE)
      cy.get("#permalink").clear().type(TEST_PAGE_PERMALNK)
      cy.contains("Save").click()

      // Asserts
      // 1. User should be redirected to correct EditPage
      cy.url().should(
        "include",
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/editPage/${TEST_PAGE_ENCODED}`
      )
      cy.contains(TEST_PAGE_TITLE, { timeout: E2E_EXTENDED_TIMEOUT }).should(
        "exist"
      )

      // 2. If user goes back to the workspace, they should be able to see that the page exists
      cy.contains("Back to Workspace", { timeout: E2E_EXTENDED_TIMEOUT })
        .should("exist")
        .click()
      cy.contains(TEST_PAGE_TITLE, { timeout: E2E_EXTENDED_TIMEOUT }).should(
        "exist"
      )
    })

    it("Should not be able to create page with invalid title", () => {
      const INVALID_TEST_PAGE_TITLES = [
        "Ab",
        "Lorem Ipsum<",
        "^Lorem Ipsum",
        "~%Lorem Ipsum",
        "/Lorem Ipsum",
        ";Lorem Ipsum",
        ">Lorem Ipsum",
        "[Lorem Ipsum",
        "]Lorem Ipsum",
      ]

      cy.get("#settings-NEW", { timeout: E2E_EXTENDED_TIMEOUT })
        .should("exist")
        .click()

      // Cannot use titles shorter than 4 characters or containing symbols ~!@#$%^&*_+-./\`:;~{}()[]"'<>,?
      INVALID_TEST_PAGE_TITLES.forEach((invalidTitle) => {
        cy.get("#title").clear().type(invalidTitle).blur()
        cy.contains("button", "Save").should("be.disabled")
      })

      // Page title must not already exist
      cy.get("#title").clear().type(TEST_PAGE_TITLE).blur()
      cy.contains("Title is already in use. Please choose a different title.")
      cy.contains("button", "Save").should("be.disabled")
    })

    it("Should not be able to create page with invalid permalink", () => {
      const INVALID_TEST_PAGE_PERMALINKS = ["/12", "test-", "/abcd?"]

      cy.get("#settings-NEW", { timeout: E2E_EXTENDED_TIMEOUT })
        .should("exist")
        .click()

      // Permalink needs to be longer than 4 characters, should start with a slash, and contain alphanumeric characters separated by hyphens and slashes only
      INVALID_TEST_PAGE_PERMALINKS.forEach((invalidPermalink) => {
        cy.get("#permalink").clear().type(invalidPermalink).blur()
        cy.contains("button", "Save").should("be.disabled")
      })
    })

    it("Should be able to edit existing page details with Chinese title and valid permalink", () => {
      const testPageCard = cy
        .contains(TEST_PAGE_TITLE, { timeout: E2E_EXTENDED_TIMEOUT })
        .should("exist")

      // User should be able edit page details
      testPageCard
        .children()
        .within(() => cy.get("[id^=pageCard-dropdown-]").click())
      cy.get("div[id^=settings-]").first().click() // .first() is necessary because the get returns multiple elements (refer to MenuDropdown.jsx)

      cy.get("#title").should("have.value", TEST_PAGE_TITLE, {
        timeout: E2E_EXTENDED_TIMEOUT,
      })

      cy.get("#title").clear().type(EDITED_TEST_PAGE_TITLE)
      cy.contains("button", "Save").click()

      // ASSERT: New page title should be reflected in the Workspace
      cy.contains(EDITED_TEST_PAGE_TITLE, {
        timeout: E2E_EXTENDED_TIMEOUT,
      }).should("exist")

      cy.wait(E2E_DEFAULT_WAIT_TIME)
    })

    it("Should be able to edit existing page details with Tamil title and valid permalink", () => {
      const testPageCard = cy
        .contains(EDITED_TEST_PAGE_TITLE, {
          timeout: E2E_EXTENDED_TIMEOUT,
        })
        .should("exist")

      // User should be able edit page details
      testPageCard
        .children()
        .within(() => cy.get("[id^=pageCard-dropdown-]").click())
      cy.get("div[id^=settings-]").first().click()

      cy.get("#title").should("have.value", EDITED_TEST_PAGE_TITLE, {
        timeout: E2E_EXTENDED_TIMEOUT,
      })

      cy.get("#title").clear().type(EDITED_TEST_PAGE_TITLE_2)
      cy.contains("button", "Save").click()

      cy.contains("Successfully updated page!", {
        timeout: E2E_EXTENDED_TIMEOUT,
      }).should("exist")

      // Asserts
      // 1. New page title should be reflected in Folders
      cy.contains(EDITED_TEST_PAGE_TITLE_2, {
        timeout: E2E_EXTENDED_TIMEOUT,
      }).should("exist")
    })

    it("Should be able to delete existing page on workspace", () => {
      // Ensure that the frontend has been updated
      cy.contains(EDITED_TEST_PAGE_TITLE, {
        timeout: E2E_EXTENDED_TIMEOUT,
      }).should("not.exist")

      // Assert
      // User should be able to remove the created test page card
      cy.contains(EDITED_TEST_PAGE_TITLE_2, { timeout: E2E_EXTENDED_TIMEOUT })
        .should("exist")
        .children()
        .within(() => cy.get("[id^=pageCard-dropdown-]").click())
      cy.get("div[id^=delete-]").first().click() // .first() is necessary because the get returns multiple elements (refer to MenuDropdown.jsx)
      cy.contains("button", "Delete", { timeout: E2E_EXTENDED_TIMEOUT })
        .should("exist")
        .click()

      cy.contains(EDITED_TEST_PAGE_TITLE_2, {
        timeout: E2E_EXTENDED_TIMEOUT,
      }).should("not.exist")
    })
  })

  describe("Create folder, rename folder, and delete folder from Workspace", () => {
    beforeEach(() => {
      cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
      window.localStorage.setItem("userId", "test")
      cy.visit(`${CMS_BASEURL}/sites/${TEST_REPO_NAME}/workspace`)
    })

    it("Test site workspace page should have folders section", () => {
      cy.contains("Create new folder", {
        timeout: E2E_EXTENDED_TIMEOUT,
      }).should("exist")
    })

    // Create
    it("Should be able to create a new folder with valid folder name with no pages", () => {
      cy.contains("Create new folder", { timeout: E2E_EXTENDED_TIMEOUT })
        .should("exist")
        .click()
      cy.get("input#newDirectoryName").clear().type(TEST_FOLDER_NO_PAGES_TITLE)
      cy.contains("Next").click()
      cy.contains("Skip").click()

      // Assert
      cy.contains(PRETTIFIED_FOLDER_NO_PAGES_TITLE, {
        timeout: E2E_EXTENDED_TIMEOUT,
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
      cy.contains("Successfully updated page", {
        timeout: E2E_EXTENDED_TIMEOUT,
      })
        .should("exist")
        .then(() =>
          cy.visit(`${CMS_BASEURL}/sites/${TEST_REPO_NAME}/workspace`)
        )

      cy.contains("Create new folder", { timeout: E2E_EXTENDED_TIMEOUT })
        .should("exist")
        .click()
      cy.get("input#newDirectoryName")
        .clear()
        .type(TEST_FOLDER_WITH_PAGES_TITLE)
      cy.contains("Next").click()
      cy.get("div[id^=folderCard-small]").contains(TEST_PAGE_TITLE).click()
      cy.contains("Done").click()

      // Assert
      cy.contains(PRETTIFIED_FOLDER_WITH_PAGES_TITLE, {
        timeout: E2E_EXTENDED_TIMEOUT,
      }).should("exist")
      cy.url().should(
        "include",
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folders/${PARSED_TEST_FOLDER_WITH_PAGES_TITLE}`
      )
      cy.contains(TEST_PAGE_TITLE, { timeout: E2E_EXTENDED_TIMEOUT })
        .should("exist")
        .click()
      cy.get(".CodeMirror-scroll", { timeout: E2E_EXTENDED_TIMEOUT }).should(
        "contain",
        TEST_PAGE_CONTENT
      )
    })

    it("Should not be able to create a new folder with invalid folder name", () => {
      // Title is too short
      const INVALID_FOLDER_TITLE = "t"
      cy.contains("Create new folder", { timeout: E2E_EXTENDED_TIMEOUT })
        .should("exist")
        .click()
      cy.get("input#newDirectoryName").clear().type(INVALID_FOLDER_TITLE).blur()
      cy.contains("Title must be longer than 2 characters")
      cy.contains("button", "Next").should("be.disabled")

      // Folder exists
      cy.get("input#newDirectoryName")
        .clear()
        .type(TEST_FOLDER_NO_PAGES_TITLE)
        .blur()
      cy.contains("Title is already in use. Please choose a different title.")
      cy.contains("button", "Next").should("be.disabled")
    })

    it("Should be able to rename a folder", () => {
      cy.contains(PRETTIFIED_FOLDER_WITH_PAGES_TITLE, {
        timeout: E2E_EXTENDED_TIMEOUT,
      })
        .should("exist")
        .within(() => cy.get("[id^=settingsIcon]").click())
      cy.get("div[id^=settings-]").first().click()
      cy.contains("Folder settings")
      cy.get("input#newDirectoryName")
        .clear()
        .type(EDITED_TEST_FOLDER_WITH_PAGES_TITLE)
      cy.contains("button", "Save").click()

      // Assert
      cy.contains(PRETTIFIED_EDITED_FOLDER_WITH_PAGES_TITLE, {
        timeout: E2E_EXTENDED_TIMEOUT,
      })
        .should("exist")
        .click()
      cy.contains(PRETTIFIED_EDITED_FOLDER_WITH_PAGES_TITLE, {
        timeout: E2E_EXTENDED_TIMEOUT,
      }).should("exist")
      cy.url().should(
        "include",
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folders/${PARSED_EDITED_TEST_FOLDER_WITH_PAGES_TITLE}`
      )

      cy.contains(TEST_PAGE_TITLE).click()
      cy.get(".CodeMirror-scroll").should("contain", TEST_PAGE_CONTENT)
    })

    it("Should be able to delete a folder", () => {
      cy.contains(PRETTIFIED_FOLDER_NO_PAGES_TITLE, {
        timeout: E2E_EXTENDED_TIMEOUT,
      })
        .should("exist")
        .within(() => cy.get("[id^=settingsIcon]").click())
      cy.get("div[id^=delete-]").first().click()
      cy.contains("button", "Delete").click()

      cy.contains(PRETTIFIED_FOLDER_NO_PAGES_TITLE, {
        timeout: E2E_EXTENDED_TIMEOUT,
      }).should("not.exist")

      cy.contains(PRETTIFIED_EDITED_FOLDER_WITH_PAGES_TITLE).within(() =>
        cy.get("[id^=settingsIcon]").click()
      )
      cy.get("div[id^=delete-]").first().click()
      cy.contains("button", "Delete").click()

      cy.contains(PRETTIFIED_EDITED_FOLDER_WITH_PAGES_TITLE, {
        timeout: E2E_EXTENDED_TIMEOUT,
      }).should("not.exist")
    })
  })
})
