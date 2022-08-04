import { slugifyCategory, titleToPageFileName, deslugifyDirectory } from "utils"

describe("Workspace Pages flow", () => {
  beforeEach(() => {
    // NOTE: Interceptors are set up for requests hitting the network
    // This is because the network round trip time might be extremely long
    // and using the inbuilt assertion for buttons might timeout (>4s)
    // even when the request is successful.
    // This waits on the request till it succeeds or timeouts (>30s).
    // Refer here for default wait times: https://docs.cypress.io/guides/references/configuration#Timeouts
    cy.intercept("POST", "/v2/**").as("saveRequest")
    cy.intercept("DELETE", "/v2/**").as("deleteRequest")
  })

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

  describe.only("Create page, delete page, edit page settings in Workspace", () => {
    beforeEach(() => {
      cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
      window.localStorage.setItem("userId", "test")
      cy.visit(`${CMS_BASEURL}/sites/${TEST_REPO_NAME}/workspace`)
      cy.contains("Verify").should("not.exist")
    })

    it("Test site workspace page should have unlinked pages section", () => {
      cy.contains("Create page")
    })

    it("Should be able to create a new page with valid title and permalink", () => {
      // Act
      cy.contains("button", "Create page").click()
      cy.get("#title").clear().type(TEST_PAGE_TITLE)
      cy.get("#permalink").clear().type(TEST_PAGE_PERMALNK)
      cy.contains("Save").click()
      cy.wait("@saveRequest")
        .its("request.body")
        .should("deep.equal", {
          content: {
            frontMatter: {
              title: TEST_PAGE_TITLE,
              permalink: TEST_PAGE_PERMALNK,
              description: "",
            },
          },
          newFileName: `${TEST_PAGE_TITLE}.md`,
        })

      // Assert
      // 1. User should be redirected to correct EditPage
      cy.url().should(
        "include",
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/editPage/${TEST_PAGE_ENCODED}`
      )
      cy.contains(TEST_PAGE_TITLE).should("exist")

      // 2. If user goes back to the workspace, they should be able to see that the page exists
      cy.contains("Back to Workspace").should("exist").click()
      cy.contains("a", TEST_PAGE_TITLE).should("exist")
    })

    it("Should not be able to create page with invalid title", () => {
      // Arrange
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

      // Act
      cy.contains("button", "Create page").click()
      // Cannot use titles shorter than 4 characters or containing symbols ~!@#$%^&*_+-./\`:;~{}()[]"'<>,?
      INVALID_TEST_PAGE_TITLES.forEach((invalidTitle) => {
        cy.get("#title").clear().type(invalidTitle).blur()
        cy.contains("button", "Save").should("be.disabled")
      })

      // Assert
      // Page title must not already exist
      cy.get("#title").clear().type(TEST_PAGE_TITLE).blur()
      cy.contains("Title is already in use. Please choose a different title.")
      cy.contains("button", "Save").should("be.disabled")
    })

    it("Should not be able to create page with invalid permalink", () => {
      // Arrange
      const INVALID_TEST_PAGE_PERMALINKS = ["/12", "test-", "/abcd?"]

      // Act
      cy.contains("button", "Create page").click()

      // Assert
      // Permalink needs to be longer than 4 characters, should start with a slash, and contain alphanumeric characters separated by hyphens and slashes only
      INVALID_TEST_PAGE_PERMALINKS.forEach((invalidPermalink) => {
        cy.get("#permalink").clear().type(invalidPermalink).blur()
        cy.contains("button", "Save").should("be.disabled")
      })
    })

    it("Should be able to edit existing page details with Chinese title and valid permalink", () => {
      // Arrange
      cy.contains("button", TEST_PAGE_TITLE)
        .parent()
        .parent()
        .as("pageCard")
        .should("exist")

      // Act
      // User should be able edit page details
      cy.clickContextMenuItem("@pageCard", "settings")
      cy.get("#title").should("have.value", TEST_PAGE_TITLE)
      cy.get("#title").clear().type(EDITED_TEST_PAGE_TITLE)
      cy.contains("button", "Save").click()
      cy.wait("@saveRequest")

      // Assert
      // New page title should be reflected in the Workspace
      cy.contains(EDITED_TEST_PAGE_TITLE).should("exist")
    })

    it("Should be able to edit existing page details with Tamil title and valid permalink", () => {
      // Arrange
      cy.contains("button", EDITED_TEST_PAGE_TITLE)
        .parent()
        .parent()
        .as("pageCard")
        .should("exist")

      // Act
      // User should be able edit page details
      cy.clickContextMenuItem("@pageCard", "settings")
      cy.get("#title").should("have.value", EDITED_TEST_PAGE_TITLE)
      cy.get("#title").clear().type(EDITED_TEST_PAGE_TITLE_2)
      cy.contains("button", "Save").click()
      cy.wait("@saveRequest")

      // Asserts
      // Should show modal
      cy.contains("Successfully updated page!").should("exist")
      // New page title should be reflected in Folders
      cy.contains(EDITED_TEST_PAGE_TITLE_2).should("exist")
    })

    it("Should be able to delete existing page on workspace", () => {
      // Arrange
      // Ensure that the frontend has been updated
      cy.contains(EDITED_TEST_PAGE_TITLE).should("not.exist")

      // Act
      // User should be able to remove the created test page card
      cy.contains("button", EDITED_TEST_PAGE_TITLE_2)
        .parent()
        .parent()
        .as("pageCard")
        .should("exist")
      cy.clickContextMenuItem("@pageCard", "Delete")
      cy.contains("button", "delete").should("exist").click()
      cy.wait("@deleteRequest")

      // Assert
      cy.contains(EDITED_TEST_PAGE_TITLE_2).should("not.exist")
    })
  })

  describe("Create folder, rename folder, and delete folder from Workspace", () => {
    beforeEach(() => {
      cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
      window.localStorage.setItem("userId", "test")
      cy.visit(`${CMS_BASEURL}/sites/${TEST_REPO_NAME}/workspace`)
      cy.contains("Verify").should("not.exist")
    })

    it("Test site workspace page should have folders section", () => {
      cy.contains("Create folder").should("exist")
    })

    // Create
    it("Should be able to create a new folder with valid folder name with no pages", () => {
      // Arrange
      cy.contains("Create folder").should("exist").click()

      // Act
      cy.get("input#newDirectoryName").clear().type(TEST_FOLDER_NO_PAGES_TITLE)
      cy.contains("Next").click()
      cy.contains("Skip").click()

      // Assert
      cy.contains(PRETTIFIED_FOLDER_NO_PAGES_TITLE).should("exist")
      cy.url().should(
        "include",
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folders/${PARSED_TEST_FOLDER_NO_PAGES_TITLE}`
      )
      cy.contains("No pages here yet.")
    })

    it("Should be able to create a new folder with valid folder name with page", () => {
      // Act
      cy.contains("Create page").should("exist").click()
      cy.get("#title").clear().type(TEST_PAGE_TITLE)
      cy.get("#permalink").clear().type(TEST_PAGE_PERMALNK)
      cy.contains("Save").click()
      cy.wait("@saveRequest")

      // Create test page content
      cy.get(".CodeMirror-scroll").type(TEST_PAGE_CONTENT)
      cy.contains("Save").click()
      cy.wait("@saveRequest")
      cy.contains("Successfully updated page")
        .should("exist")
        .then(() =>
          cy.visit(`${CMS_BASEURL}/sites/${TEST_REPO_NAME}/workspace`)
        )

      cy.contains("Create folder").should("exist").click()
      cy.get("input#newDirectoryName")
        .clear()
        .type(TEST_FOLDER_WITH_PAGES_TITLE)
      cy.contains("Next").click()
      cy.get("button[id^=folderCard-small]").contains(TEST_PAGE_TITLE).click()
      cy.contains("Done").click()

      // Assert
      cy.contains(PRETTIFIED_FOLDER_WITH_PAGES_TITLE).should("exist")
      cy.url().should(
        "include",
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folders/${PARSED_TEST_FOLDER_WITH_PAGES_TITLE}`
      )
      cy.contains("a", TEST_PAGE_TITLE).should("exist").click()
      cy.get(".CodeMirror-scroll").should("contain", TEST_PAGE_CONTENT)
    })

    it("Should not be able to create a new folder with invalid folder name", () => {
      // Title is too short
      const INVALID_FOLDER_TITLE = "t"
      cy.contains("Create folder").should("exist").click()
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
      cy.contains("button", PRETTIFIED_FOLDER_WITH_PAGES_TITLE)
        .parent()
        .parent()
        .as("folderItem")
        .should("exist")
      cy.clickContextMenuItem("@folderItem", "settings")
      cy.get("input#newDirectoryName")
        .clear()
        .type(EDITED_TEST_FOLDER_WITH_PAGES_TITLE)
      cy.contains("button", "Save").click()
      cy.wait("@saveRequest")

      // Assert
      cy.contains("button", PRETTIFIED_EDITED_FOLDER_WITH_PAGES_TITLE)
        .should("exist")
        .click()
      cy.url().should(
        "include",
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folders/${PARSED_EDITED_TEST_FOLDER_WITH_PAGES_TITLE}`
      )

      cy.contains("a", TEST_PAGE_TITLE).click()
      cy.get(".CodeMirror-scroll").should("contain", TEST_PAGE_CONTENT)
    })

    it("Should be able to delete a folder with no pages", () => {
      // Arrange
      cy.contains("a", PRETTIFIED_FOLDER_NO_PAGES_TITLE)
        .as("emptyFolderItem")
        .should("exist")

      // Act
      cy.clickContextMenuItem("@emptyFolderItem", "Delete")
      cy.contains("button", "delete").click()

      // Act
      cy.clickContextMenuItem("@folderItem", "Delete")
      cy.contains("button", "delete").click()

      // Assert
      cy.contains(PRETTIFIED_EDITED_FOLDER_WITH_PAGES_TITLE).should("not.exist")
    })
  })
})
