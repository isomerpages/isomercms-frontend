import slugify from "slugify"

import {
  titleToPageFileName,
  pageFileNameToTitle,
  deslugifyDirectory,
} from "../../src/utils"
import {
  E2E_DEFAULT_WAIT_TIME,
  E2E_EXTENDED_TIMEOUT,
} from "../fixtures/constants"

describe("Folders flow", () => {
  const COOKIE_NAME = Cypress.env("COOKIE_NAME")
  const COOKIE_VALUE = Cypress.env("COOKIE_VALUE")

  before(() => {
    cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
  })

  const CMS_BASEURL = Cypress.env("BASEURL")
  const TEST_REPO_NAME = Cypress.env("TEST_REPO_NAME")
  const DEFAULT_REPO_FOLDER_NAME = "default"
  const PRETTIFIED_DEFAULT_REPO_FOLDER_NAME = deslugifyDirectory(
    DEFAULT_REPO_FOLDER_NAME
  )

  const DEFAULT_PAGE_TITLE = "Lorem Ipsum"
  const DEFAULT_PAGE_FILENAME = titleToPageFileName(DEFAULT_PAGE_TITLE)
  const PRETTIFIED_DEFAULT_PAGE_TITLE = pageFileNameToTitle(
    DEFAULT_PAGE_FILENAME
  )

  const TEST_PAGE_TITLE = "New Lorem Ipsum"
  const TEST_PAGE_FILENAME = titleToPageFileName(TEST_PAGE_TITLE)
  const PRETTIFIED_PAGE_TITLE = pageFileNameToTitle(TEST_PAGE_FILENAME)
  const PARSED_TEST_PAGE_TITLE = encodeURIComponent(PRETTIFIED_PAGE_TITLE)

  const EDITED_TEST_PAGE_PERMALNK = "/test-permalink"

  const DEFAULT_TEST_PAGE_CONTENT =
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit."

  const EDITED_TEST_PAGE_TITLE = "把我如到價小岸發"
  const EDITED_TEST_PAGE_FILENAME = titleToPageFileName(EDITED_TEST_PAGE_TITLE)
  const PRETTIFIED_EDITED_TEST_PAGE_TITLE = pageFileNameToTitle(
    EDITED_TEST_PAGE_FILENAME
  )

  const EDITED_TEST_PAGE_TITLE_2 = "லோரம் இப்சம்"

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
  const INVALID_TEST_PAGE_PERMALINKS = ["/12", "test-", "/abcd?"]

  const INVALID_SUBFOLDER_TITLES = [
    "t",
    "/abc",
    "%abc",
    "[abc]",
    "~abc",
    "<abc>",
  ]

  const TEST_SUBFOLDER_NO_PAGES_TITLE = "test subfolder title no pages"
  const PRETTIFIED_SUBFOLDER_NO_PAGES_TITLE = deslugifyDirectory(
    TEST_SUBFOLDER_NO_PAGES_TITLE
  )
  const PARSED_TEST_SUBFOLDER_NO_PAGES_TITLE = encodeURIComponent(
    PRETTIFIED_SUBFOLDER_NO_PAGES_TITLE
  )
  const SLUGIFIED_PRETTIFIED_SUBFOLDER_NO_PAGES_TITLE = slugify(
    PRETTIFIED_SUBFOLDER_NO_PAGES_TITLE
  )

  const TEST_SUBFOLDER_WITH_PAGES_TITLE = "test subfolder title with page"
  const PRETTIFIED_SUBFOLDER_WITH_PAGES_TITLE = deslugifyDirectory(
    TEST_SUBFOLDER_WITH_PAGES_TITLE
  )
  const PARSED_TEST_SUBFOLDER_WITH_PAGES_TITLE = encodeURIComponent(
    PRETTIFIED_SUBFOLDER_WITH_PAGES_TITLE
  )

  const EDITED_TEST_SUBFOLDER_WITH_PAGES_TITLE = "edited subfolder with pages"
  const PRETTIFIED_EDITED_SUBFOLDER_WITH_PAGES_TITLE = deslugifyDirectory(
    EDITED_TEST_SUBFOLDER_WITH_PAGES_TITLE
  )
  const PARSED_EDITED_TEST_SUBFOLDER_WITH_PAGES_TITLE = encodeURIComponent(
    PRETTIFIED_EDITED_SUBFOLDER_WITH_PAGES_TITLE
  )

  describe("Create subfolder, rename subfolder, delete subfolder from Folders", () => {
    beforeEach(() => {
      Cypress.Cookies.preserveOnce(COOKIE_NAME)
      window.localStorage.setItem("userId", "test")
      cy.visit(
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folders/${DEFAULT_REPO_FOLDER_NAME}`
      )
      // Wait for 1s for page to become stable.
      // This is because there's a modal on first paint that gets removed on second paint
      cy.wait(1 * 1000)
    })

    it("Should be able to create a new sub-folder within a valid folder name with no pages", () => {
      cy.get('button[aria-label="Select options"]').as("dropdown").click()
      cy.clickContextMenuItem("@dropdown", "folder")
      cy.get("input#newDirectoryName")
        .clear()
        .type(TEST_SUBFOLDER_NO_PAGES_TITLE)
      cy.contains("Next").click()
      cy.contains("Skip").click()

      // Assert
      cy.contains(PRETTIFIED_SUBFOLDER_NO_PAGES_TITLE, {
        timeout: E2E_EXTENDED_TIMEOUT,
      }).should("exist")
      cy.url().should(
        "include",
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folders/${DEFAULT_REPO_FOLDER_NAME}/subfolders/${PARSED_TEST_SUBFOLDER_NO_PAGES_TITLE}`
      )
      cy.contains("No pages here yet.")
    })

    it("Should be able to create a new sub-folder within a valid folder name with one page", () => {
      cy.get('button[aria-label="Select options"]').as("dropdown").click()
      cy.clickContextMenuItem("@dropdown", "folder")
      cy.get("input#newDirectoryName")
        .clear()
        .type(TEST_SUBFOLDER_WITH_PAGES_TITLE)
        .blur()
      cy.contains("Next").click()

      cy.get("button[id^=folderCard-small]")
        .contains(PRETTIFIED_DEFAULT_PAGE_TITLE)
        .click()
      cy.contains("Done").click()

      // Assert
      cy.contains(PRETTIFIED_SUBFOLDER_WITH_PAGES_TITLE, {
        timeout: E2E_EXTENDED_TIMEOUT,
      }).should("exist")
      cy.url().should(
        "include",
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folders/${DEFAULT_REPO_FOLDER_NAME}/subfolders/${PARSED_TEST_SUBFOLDER_WITH_PAGES_TITLE}`
      )
      cy.contains("a", PRETTIFIED_DEFAULT_PAGE_TITLE).click()
      cy.get(".CodeMirror-scroll").should("contain", DEFAULT_TEST_PAGE_CONTENT)
    })

    it("Should not be able to create a new sub-folder with invalid sub-folder name", () => {
      cy.contains(PRETTIFIED_SUBFOLDER_WITH_PAGES_TITLE, {
        timeout: E2E_EXTENDED_TIMEOUT,
      }).should("exist")

      cy.get('button[aria-label="Select options"]').as("dropdown").click()
      cy.clickContextMenuItem("@dropdown", "folder")

      // Cannot use titles shorter than 2 characters or containing symbols ~!@#$%^&*_+-./\`:;~{}()[]"'<>,?
      INVALID_SUBFOLDER_TITLES.forEach((invalidTitle) => {
        cy.get("input#newDirectoryName").clear().type(invalidTitle).blur()
        cy.contains("button", "Next").should("be.disabled")
      })

      // Subfolder exists
      cy.get("input#newDirectoryName")
        .clear()
        .type(TEST_SUBFOLDER_WITH_PAGES_TITLE)
        .blur()
      cy.contains("Title is already in use. Please choose a different title.")
      cy.contains("button", "Next").should("be.disabled")
    })

    it("Should not be able to create a nested sub-folder within a sub-folder", () => {
      cy.visit(
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folders/${DEFAULT_REPO_FOLDER_NAME}/subfolders/${PARSED_TEST_SUBFOLDER_NO_PAGES_TITLE}`
      )
      cy.get('button[aria-label="Select options"]').should("not.exist")
    })

    // Rename
    it("Should be able to rename a sub-folder", () => {
      cy.intercept({
        method: "POST",
        url: `/v2/sites/e2e-test-repo/collections/${DEFAULT_REPO_FOLDER_NAME}/subcollections/${PARSED_TEST_SUBFOLDER_WITH_PAGES_TITLE}`,
      }).as("renameSubfolder")

      cy.contains("a", PRETTIFIED_SUBFOLDER_WITH_PAGES_TITLE).as("folderItem")
      cy.clickContextMenuItem("@folderItem", "settings")
      cy.contains(`Subfolder settings`)
      cy.get("input#newDirectoryName")
        .clear()
        .type(EDITED_TEST_SUBFOLDER_WITH_PAGES_TITLE)
      cy.contains("button", "Save").click()

      // Assert
      cy.wait("@renameSubfolder")
      cy.contains("1 item").should("exist")
      cy.contains("a", PRETTIFIED_EDITED_SUBFOLDER_WITH_PAGES_TITLE).click()
      cy.contains(PRETTIFIED_EDITED_SUBFOLDER_WITH_PAGES_TITLE)
      cy.url().should(
        "include",
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folders/${DEFAULT_REPO_FOLDER_NAME}/subfolders/${PARSED_EDITED_TEST_SUBFOLDER_WITH_PAGES_TITLE}`
      )
      cy.contains("a", PRETTIFIED_DEFAULT_PAGE_TITLE).click()
      cy.get(".CodeMirror-scroll").should("contain", DEFAULT_TEST_PAGE_CONTENT)
    })

    // Delete
    it("Should be able to delete a sub-folder with a page", () => {
      cy.contains("a", PRETTIFIED_EDITED_SUBFOLDER_WITH_PAGES_TITLE)
        .as("folderItem")
        .should("exist")
      cy.clickContextMenuItem("@folderItem", "Delete")
      cy.contains("button", "Delete").click()
      cy.wait(E2E_DEFAULT_WAIT_TIME)

      // Assert
      cy.contains(PRETTIFIED_EDITED_SUBFOLDER_WITH_PAGES_TITLE).should(
        "not.exist"
      )
    })

    it("Should be able to delete a sub-folder without page", () => {
      cy.contains("a", PRETTIFIED_SUBFOLDER_NO_PAGES_TITLE).as("folderItem")
      cy.clickContextMenuItem("@folderItem", "Delete")
      cy.contains("button", "Delete").click()

      // Assert
      cy.contains(PRETTIFIED_SUBFOLDER_NO_PAGES_TITLE).should("not.exist", {
        timeout: E2E_EXTENDED_TIMEOUT,
      })
      cy.contains("No pages here yet.", {
        timeout: E2E_EXTENDED_TIMEOUT,
      }).should("exist")
    })
  })

  describe("Create page, delete page, edit page settings in folder", () => {
    beforeEach(() => {
      Cypress.Cookies.preserveOnce(COOKIE_NAME)
      window.localStorage.setItem("userId", "test")
      cy.visit(
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folders/${DEFAULT_REPO_FOLDER_NAME}`
      )
      // Wait for 1s for page to become stable.
      // This is because there's a modal on first paint that gets removed on second paint
      cy.wait(1 * 1000)
    })

    it("Should be able to create a new page with valid title and permalink", () => {
      const DEFAULT_TEST_PAGE_PERMALINK = `/${DEFAULT_REPO_FOLDER_NAME}/permalink`
      cy.contains("Create page", { timeout: E2E_EXTENDED_TIMEOUT })
        .should("exist")
        .click()
      cy.get("#title").clear().type(TEST_PAGE_TITLE)

      // Asserts that default permalink is right
      cy.get("#permalink").should("have.value", DEFAULT_TEST_PAGE_PERMALINK)

      cy.get("#permalink").clear().type(EDITED_TEST_PAGE_PERMALNK)
      cy.contains("Save").click()

      // Asserts
      // 1. User should be redirected to correct EditPage
      cy.url().should(
        "include",
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folders/${DEFAULT_REPO_FOLDER_NAME}/editPage/${PARSED_TEST_PAGE_TITLE}`
      )
      cy.contains(PRETTIFIED_PAGE_TITLE, {
        timeout: E2E_EXTENDED_TIMEOUT,
      }).should("exist")

      cy.get(".CodeMirror-scroll").type(DEFAULT_TEST_PAGE_CONTENT)
      cy.contains(":button", "Save").click()

      // 2. If user goes back to the workspace, they should be able to see that the page exists
      cy.contains("button", PRETTIFIED_DEFAULT_REPO_FOLDER_NAME).click()
      cy.contains(PRETTIFIED_PAGE_TITLE, {
        timeout: E2E_EXTENDED_TIMEOUT,
      }).should("exist")
    })

    it("Should not be able to create page with invalid title", () => {
      cy.contains("Create page", { timeout: E2E_EXTENDED_TIMEOUT })
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
      cy.contains("Create page", { timeout: E2E_EXTENDED_TIMEOUT })
        .should("exist")
        .click()

      // Permalink needs to be longer than 4 characters, should start with a slash, and contain alphanumeric characters separated by hyphens and slashes only
      INVALID_TEST_PAGE_PERMALINKS.forEach((invalidPermalink) => {
        cy.get("#permalink").clear().type(invalidPermalink).blur()
        cy.contains("button", "Save").should("be.disabled")
      })
    })

    it("Should be able to edit existing page details with Chinese title and valid permalink", () => {
      cy.contains("a", TEST_PAGE_TITLE, { timeout: E2E_EXTENDED_TIMEOUT })
        .as("pageItem")
        .should("exist")
      cy.clickContextMenuItem("@pageItem", "settings")

      cy.get("#title").should("have.value", PRETTIFIED_PAGE_TITLE, {
        timeout: E2E_EXTENDED_TIMEOUT,
      })

      cy.get("#title").clear().type(EDITED_TEST_PAGE_TITLE)
      cy.contains("button", "Save").click()
      cy.contains("Successfully updated page!", {
        timeout: E2E_EXTENDED_TIMEOUT,
      }).should("exist")

      // Asserts
      // 1. New page title should be reflected in Folders
      cy.reload()
      cy.contains(EDITED_TEST_PAGE_TITLE, {
        timeout: E2E_EXTENDED_TIMEOUT,
      }).should("exist")

      // 2. Test page content should still be in Edit Page
      cy.contains("a", EDITED_TEST_PAGE_TITLE).should("exist").click()
      cy.get(".CodeMirror-scroll").should("contain", DEFAULT_TEST_PAGE_CONTENT)
    })

    it("Should be able to edit existing page details with Tamil title and valid permalink", () => {
      cy.contains("a", EDITED_TEST_PAGE_TITLE, {
        timeout: E2E_EXTENDED_TIMEOUT,
      })
        .as("pageItem")
        .should("exist")
      cy.clickContextMenuItem("@pageItem", "settings")
      cy.get("#title").should("have.value", PRETTIFIED_EDITED_TEST_PAGE_TITLE, {
        timeout: E2E_EXTENDED_TIMEOUT,
      })

      cy.get("#title").clear().type(EDITED_TEST_PAGE_TITLE_2)
      cy.contains("button", "Save").click()
      cy.contains("Successfully updated page!", {
        timeout: E2E_EXTENDED_TIMEOUT,
      }).should("exist")

      // Asserts
      // 1. New page title should be reflected in Folders
      cy.reload()
      cy.contains(EDITED_TEST_PAGE_TITLE_2, {
        timeout: E2E_EXTENDED_TIMEOUT,
      }).should("exist")

      // 2. Test page content should still be in Edit Page
      cy.contains("a", EDITED_TEST_PAGE_TITLE_2).should("exist").click()
      cy.get(".CodeMirror-scroll").should("contain", DEFAULT_TEST_PAGE_CONTENT)
    })

    it("Should be able to delete existing page in folder", () => {
      // User should be able to remove the created test page card
      cy.contains("a", EDITED_TEST_PAGE_TITLE_2).as("pageItem").should("exist")
      cy.clickContextMenuItem("@pageItem", "Delete")
      cy.contains("button", "Delete").click()

      cy.contains("Successfully deleted page", {
        timeout: E2E_EXTENDED_TIMEOUT,
      }).should("exist")

      cy.reload()
      cy.contains(EDITED_TEST_PAGE_TITLE, {
        timeout: E2E_EXTENDED_TIMEOUT,
      }).should("not.exist")
    })
  })

  describe.only("Create page, delete page, edit page settings in subfolder", () => {
    before(() => {
      Cypress.Cookies.preserveOnce(COOKIE_NAME)
      window.localStorage.setItem("userId", "test")
      cy.visit(
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folders/${DEFAULT_REPO_FOLDER_NAME}`
      )
      cy.get('button[aria-label="Select options"]').as("dropdown").click()
      cy.clickContextMenuItem("@dropdown", "folder")
      cy.get("input#newDirectoryName")
        .clear()
        .type(TEST_SUBFOLDER_NO_PAGES_TITLE)
      cy.contains("Next").click()
      cy.contains("Skip").click()

      // Assert
      cy.contains(PRETTIFIED_SUBFOLDER_NO_PAGES_TITLE, {
        timeout: E2E_EXTENDED_TIMEOUT,
      }).should("exist")
      cy.url().should(
        "include",
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folders/${DEFAULT_REPO_FOLDER_NAME}/subfolders/${PARSED_TEST_SUBFOLDER_NO_PAGES_TITLE}`
      )
      cy.contains("No pages here yet.")
    })

    beforeEach(() => {
      Cypress.Cookies.preserveOnce(COOKIE_NAME)
      window.localStorage.setItem("userId", "test")
      cy.visit(
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folders/${DEFAULT_REPO_FOLDER_NAME}/subfolders/${PARSED_TEST_SUBFOLDER_NO_PAGES_TITLE}`
      )
      // Wait for 1s for page to become stable.
      // This is because there's a modal on first paint that gets removed on second paint
      cy.wait(1 * 1000)
    })

    it("Should be able to create a new page with valid title and permalink", () => {
      const DEFAULT_TEST_PAGE_PERMALINK = `/${DEFAULT_REPO_FOLDER_NAME}/${SLUGIFIED_PRETTIFIED_SUBFOLDER_NO_PAGES_TITLE}/permalink`

      cy.contains("Create page", { timeout: E2E_EXTENDED_TIMEOUT })
        .should("exist")
        .click()
      cy.get("#title").clear().type(TEST_PAGE_TITLE)

      // Asserts that default permalink is right
      cy.get("#permalink").should("have.value", DEFAULT_TEST_PAGE_PERMALINK)

      cy.get("#permalink").clear().type(EDITED_TEST_PAGE_PERMALNK)
      cy.contains("Save").click()

      // Asserts
      // 1. User should be redirected to correct EditPage
      cy.url().should(
        "include",
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folders/${DEFAULT_REPO_FOLDER_NAME}/subfolders/${PARSED_TEST_SUBFOLDER_NO_PAGES_TITLE}/editPage/${PARSED_TEST_PAGE_TITLE}`
      )
      cy.contains(PRETTIFIED_PAGE_TITLE, {
        timeout: E2E_EXTENDED_TIMEOUT,
      }).should("exist")

      cy.get(".CodeMirror-scroll").type(DEFAULT_TEST_PAGE_CONTENT)
      cy.contains(":button", "Save").click()

      // 2. If user goes back to the workspace, they should be able to see that the page exists
      cy.contains("button", PRETTIFIED_SUBFOLDER_NO_PAGES_TITLE).click()
      cy.contains(PRETTIFIED_PAGE_TITLE, {
        timeout: E2E_EXTENDED_TIMEOUT,
      }).should("exist")
    })

    it("Should not be able to create page with invalid title", () => {
      cy.contains("Create page", { timeout: E2E_EXTENDED_TIMEOUT })
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
      cy.contains("Create page", { timeout: E2E_EXTENDED_TIMEOUT })
        .should("exist")
        .click()

      // Permalink needs to be longer than 4 characters, should start with a slash, and contain alphanumeric characters separated by hyphens and slashes only
      INVALID_TEST_PAGE_PERMALINKS.forEach((invalidPermalink) => {
        cy.get("#permalink").clear().type(invalidPermalink).blur()
        cy.contains("button", "Save").should("be.disabled")
      })
    })

    it("Should be able to edit existing page details with Chinese title and valid permalink", () => {
      cy.contains("a", TEST_PAGE_TITLE, { timeout: E2E_EXTENDED_TIMEOUT })
        .as("pageItem")
        .should("exist")
      cy.clickContextMenuItem("@pageItem", "settings")
      cy.get("#title").should("have.value", PRETTIFIED_PAGE_TITLE, {
        timeout: E2E_EXTENDED_TIMEOUT,
      })

      cy.get("#title").clear().type(EDITED_TEST_PAGE_TITLE)
      cy.contains("button", "Save").click()
      cy.contains("Successfully updated page!", {
        timeout: E2E_EXTENDED_TIMEOUT,
      }).should("exist")

      // Asserts
      // 1. New page title should be reflected in Folders
      cy.reload()
      cy.contains(EDITED_TEST_PAGE_TITLE, {
        timeout: E2E_EXTENDED_TIMEOUT,
      }).should("exist")

      // 2. Test page content should still be in Edit Page
      cy.contains("a", EDITED_TEST_PAGE_TITLE).should("exist").click()
      cy.get(".CodeMirror-scroll").should("contain", DEFAULT_TEST_PAGE_CONTENT)
    })

    it("Should be able to edit existing page details with Tamil title and valid permalink", () => {
      cy.contains("a", EDITED_TEST_PAGE_TITLE, {
        timeout: E2E_EXTENDED_TIMEOUT,
      })
        .as("pageItem")
        .should("exist")
      cy.clickContextMenuItem("@pageItem", "settings")
      cy.get("#title").should("have.value", PRETTIFIED_EDITED_TEST_PAGE_TITLE, {
        timeout: E2E_EXTENDED_TIMEOUT,
      })

      cy.get("#title").clear().type(EDITED_TEST_PAGE_TITLE_2)
      cy.contains("button", "Save").click()
      cy.contains("Successfully updated page!", {
        timeout: E2E_EXTENDED_TIMEOUT,
      }).should("exist")

      // Asserts
      // 1. New page title should be reflected in Folders
      cy.reload()
      cy.contains(EDITED_TEST_PAGE_TITLE_2, {
        timeout: E2E_EXTENDED_TIMEOUT,
      }).should("exist")

      // 2. Test page content should still be in Edit Page
      cy.contains("a", EDITED_TEST_PAGE_TITLE_2).should("exist").click()
      cy.get(".CodeMirror-scroll").should("contain", DEFAULT_TEST_PAGE_CONTENT)
    })

    it("Should be able to delete existing page in folder", () => {
      // User should be able to remove the created test page card
      cy.contains("a", EDITED_TEST_PAGE_TITLE_2).as("pageItem")
      cy.clickContextMenuItem("@pageItem", "Delete")
      cy.contains("button", "Delete").click()
      cy.contains("Successfully deleted page", {
        timeout: E2E_EXTENDED_TIMEOUT,
      }).should("exist")

      cy.reload()
      cy.contains(EDITED_TEST_PAGE_TITLE, {
        timeout: E2E_EXTENDED_TIMEOUT,
      }).should("not.exist")
    })
  })
})
