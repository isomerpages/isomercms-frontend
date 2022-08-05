import "cypress-file-upload"
import { E2E_DEFAULT_WAIT_TIME } from "../fixtures/constants"

describe("Files", () => {
  Cypress.config("baseUrl", Cypress.env("BASEURL"))
  const COOKIE_NAME = Cypress.env("COOKIE_NAME")
  const COOKIE_VALUE = Cypress.env("COOKIE_VALUE")
  const TEST_REPO_NAME = Cypress.env("TEST_REPO_NAME")

  const FILE_TITLE = "singapore.pdf"
  const OTHER_FILE_TITLE = "america.pdf"
  const EXISTING_FILE_TITLE = "New Uber BrandSystem QuickGuide.pdf"
  const TEST_FILE_PATH = "files/singapore.pdf"

  const DIRECTORY_TITLE = "Purple"
  const OTHER_DIRECTORY_TITLE = "Green"

  const MISSING_EXTENSION = "singapore"
  const INVALID_CHARACTER = "%%%%.pdf"
  const ACTION_DISABLED = true

  describe("Create file, delete file, edit file settings in Files", () => {
    beforeEach(() => {
      cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
      window.localStorage.setItem("userId", "test")

      cy.visit(`/sites/${TEST_REPO_NAME}/media/files/mediaDirectory/files`)
      cy.wait(E2E_DEFAULT_WAIT_TIME)
    })

    it("Files should contain Directories and Ungrouped Files", () => {
      cy.contains("Directories")
      cy.contains("Ungrouped files")
      cy.contains("Upload new file")
      cy.contains("Create new directory")
    })

    it("Should be able to create new file with valid title", () => {
      // Set intercept to listen for POST request on server
      cy.intercept({
        method: "POST",
        url: `/v2/sites/${TEST_REPO_NAME}/media/files/pages`,
      }).as("createFile")

      cy.uploadMedia(FILE_TITLE, TEST_FILE_PATH)

      // ASSERTS
      cy.wait("@createFile") // should intercept POST request
      cy.contains(FILE_TITLE).should("exist") // file should be contained in Files
    })

    it("Should be able to edit a file", () => {
      // Set intercept to listen for POST request on server
      cy.intercept({
        method: "POST",
        url: `/v2/sites/${TEST_REPO_NAME}/media/files/pages/${FILE_TITLE}`,
      }).as("renameFile")
      cy.renameMedia(FILE_TITLE, OTHER_FILE_TITLE)

      // ASSERTS
      cy.wait("@renameFile")
      cy.contains(OTHER_FILE_TITLE).should("exist") // file should be contained in Files
    })

    it("Should not be able to create file with invalid title", () => {
      // should not be able to save with invalid characters in title
      cy.uploadMedia(INVALID_CHARACTER, TEST_FILE_PATH, ACTION_DISABLED)

      // ASSERTS
      cy.contains(
        "Title cannot contain any of the following special characters"
      )
      cy.contains("button", /^Upload$/).should("be.disabled") // necessary as multiple buttons containing Upload on page
      cy.get("[aria-label=Close]").click()

      // title should not allow for names without extensions
      cy.uploadMedia(MISSING_EXTENSION, TEST_FILE_PATH, ACTION_DISABLED)
      // ASSERTS
      cy.contains("Title must end with the following extension")
      cy.contains("button", /^Upload$/).should("be.disabled") // necessary as multiple buttons containing Upload on page
      cy.get("[aria-label=Close]").click()

      // users should not be able to create file with duplicated filename in folder
      cy.uploadMedia(OTHER_FILE_TITLE, TEST_FILE_PATH, ACTION_DISABLED)
      // ASSERTS
      cy.contains("Title is already in use. Please choose a different title.")
      cy.contains("button", /^Upload$/).should("be.disabled") // necessary as multiple buttons containing Upload on page
    })

    it("Should not be able to edit file and save with invalid title", () => {
      // should not be able to save with invalid characters in title
      cy.renameMedia(OTHER_FILE_TITLE, INVALID_CHARACTER, ACTION_DISABLED)
      // ASSERTS
      cy.contains(
        "Title cannot contain any of the following special characters"
      )
      cy.contains("button", /^Save$/).should("be.disabled") // necessary as multiple buttons containing Upload on page
      cy.get("[aria-label=Close]").click()
      cy.get("[aria-label=Close]").should("not.exist")

      // title should not allow for names without extensions
      cy.renameMedia(OTHER_FILE_TITLE, MISSING_EXTENSION, ACTION_DISABLED)
      // ASSERTS
      cy.contains("Title must end with the following extension")
      cy.contains("button", /^Save$/).should("be.disabled") // necessary as multiple buttons containing Upload on page
      cy.get("[aria-label=Close]").click()
      cy.get("[aria-label=Close]").should("not.exist")

      cy.renameMedia(OTHER_FILE_TITLE, EXISTING_FILE_TITLE, ACTION_DISABLED)
      cy.contains("Title is already in use. Please choose a different title.")
      cy.contains("button", /^Save$/).should("be.disabled") // necessary as multiple buttons containing Upload on page
    })

    it("Should be able to delete file", () => {
      cy.contains("button", OTHER_FILE_TITLE).as("filePreview")
      cy.clickContextMenuItem("@filePreview", "Delete")
      cy.contains("button", "delete").click()
      // ASSERTS
      cy.contains(OTHER_FILE_TITLE).should("not.exist") // File name should not exist in Files
    })
  })

  describe("Create file directory, delete file directory, edit file directory settings in Files", () => {
    beforeEach(() => {
      cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
      window.localStorage.setItem("userId", "test")

      cy.visit(`/sites/${TEST_REPO_NAME}/media/files/mediaDirectory/files`)
    })

    it("Should be able to create new file directory", () => {
      // Set intercept to listen for POST request on server
      cy.contains("Create new directory").click()
      cy.get("#newDirectoryName").clear().type(DIRECTORY_TITLE)

      cy.get("button")
        .contains(/^Next$/)
        .click()

      cy.get("button")
        .contains(/^Skip$/)
        .click()
        .should("not.exist")

      // ASSERTS
      cy.contains(DIRECTORY_TITLE).should("exist") // Directory name should be contained in Files
    })

    it("Should be able to edit file directory name", () => {
      // User should be able edit directory details
      cy.contains("div", DIRECTORY_TITLE)
        .parent()
        .parent()
        .should("exist")
        .as("folderItem")
      cy.clickContextMenuItem("@folderItem", "settings")
      cy.get("#newDirectoryName").clear().type(OTHER_DIRECTORY_TITLE)
      cy.contains("button", "Save").click().should("not.exist")

      // ASSERTS
      cy.contains(OTHER_DIRECTORY_TITLE).should("exist") // New file directory name should be contained in Files
    })

    it("Should be able to delete file directory", () => {
      // User should be able delete directory
      cy.contains("div", OTHER_DIRECTORY_TITLE)
        .parent()
        .parent()
        .should("exist")
        .as("folderItem")
      cy.clickContextMenuItem("@folderItem", "Delete")
      cy.contains("button", "delete").click().should("not.exist")

      // ASSERTS
      cy.contains(OTHER_DIRECTORY_TITLE).should("not.exist") // Directory name should not be contained in Files
    })
  })

  describe("Create file, delete file, edit file settings, and move files in file directories", () => {
    before(() => {
      cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
      window.localStorage.setItem("userId", "test")

      cy.visit(`/sites/${TEST_REPO_NAME}/media/files/mediaDirectory/files`)
      cy.contains("Create new directory").click()
      cy.get("#newDirectoryName").clear().type(DIRECTORY_TITLE)
      cy.get("button")
        .contains(/^Next$/)
        .click()

      cy.get("button")
        .contains(/^Skip$/)
        .click()
        .should("not.exist")

      // Assert
      cy.contains(DIRECTORY_TITLE).should("exist")
    })

    beforeEach(() => {
      cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
      window.localStorage.setItem("userId", "test")

      cy.visit(
        `/sites/${TEST_REPO_NAME}/media/files/mediaDirectory/files%2F${DIRECTORY_TITLE}`
      )
    })

    it("Should be able to add file to file directory", () => {
      cy.uploadMedia(FILE_TITLE, TEST_FILE_PATH)

      // ASSERTS
      cy.contains("Media file successfully uploaded").should("exist")
      cy.contains(FILE_TITLE).should("exist") // file should be contained in Files
    })

    it("Should be able to edit an file in file directory", () => {
      cy.contains(FILE_TITLE).should("exist")
      cy.renameMedia(FILE_TITLE, OTHER_FILE_TITLE)

      // ASSERTS
      cy.contains(OTHER_FILE_TITLE).should("exist") // File should be contained in Files
      cy.contains("Successfully updated media file!").should("exist")
    })

    it("Should be able to delete file from file directory", () => {
      cy.contains(OTHER_FILE_TITLE).as("fileItem")
      cy.clickContextMenuItem("@fileItem", "Delete")
      cy.contains("button", "delete").click().should("not.exist")

      // ASSERTS
      cy.contains(OTHER_FILE_TITLE).should("not.exist") // File file name should not exist in Files
    })
  })
})
