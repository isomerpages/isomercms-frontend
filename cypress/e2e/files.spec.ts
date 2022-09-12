import "cypress-file-upload"
import { Interceptors, TEST_REPO_NAME } from "../fixtures/constants"

describe("Files", () => {
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
      cy.setSessionDefaults()
      cy.setupDefaultInterceptors()

      cy.visit(
        `/sites/${TEST_REPO_NAME}/media/files/mediaDirectory/files`
      ).wait(Interceptors.GET)
      cy.contains("Verify").should("not.exist")
    })

    it("Files should contain Directories and Ungrouped Files", () => {
      cy.contains("Directories")
      cy.contains("Ungrouped files")
      cy.contains("Upload file")
      cy.contains("Create directory")
    })

    it("Should be able to create new file with valid title", () => {
      cy.uploadMedia(FILE_TITLE, TEST_FILE_PATH)

      // ASSERTS
      cy.contains(FILE_TITLE).should("exist") // file should be contained in Files
    })

    it("Should be able to edit a file", () => {
      cy.renameUngroupedMedia(FILE_TITLE, OTHER_FILE_TITLE)

      // ASSERTS
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
      cy.wait(Interceptors.GET)
      cy.renameUngroupedMedia(
        OTHER_FILE_TITLE,
        INVALID_CHARACTER,
        ACTION_DISABLED
      )
      // ASSERTS
      cy.contains(
        "Title cannot contain any of the following special characters"
      )
      cy.contains("button", /^Save$/).should("be.disabled") // necessary as multiple buttons containing Upload on page
      cy.get("[aria-label=Close]").click().should("not.exist")

      // title should not allow for names without extensions
      cy.wait(Interceptors.GET)
      cy.renameUngroupedMedia(
        OTHER_FILE_TITLE,
        MISSING_EXTENSION,
        ACTION_DISABLED
      )

      // ASSERTS
      cy.contains("Title must end with the following extension")
      cy.contains("button", /^Save$/).should("be.disabled") // necessary as multiple buttons containing Upload on page
      cy.get("[aria-label=Close]").click().should("not.exist")

      cy.wait(Interceptors.GET)
      cy.renameUngroupedMedia(
        OTHER_FILE_TITLE,
        EXISTING_FILE_TITLE,
        ACTION_DISABLED
      )
      cy.contains("Title is already in use. Please choose a different title.")
      cy.contains("button", /^Save$/).should("be.disabled") // necessary as multiple buttons containing Upload on page
    })

    it("Should be able to delete file", () => {
      cy.contains("div", OTHER_FILE_TITLE).as("filePreview")
      cy.clickContextMenuItem("@filePreview", "Delete file")
      cy.contains("button", "delete").click().wait(Interceptors.DELETE)

      // ASSERTS
      cy.contains(OTHER_FILE_TITLE).should("not.exist") // File name should not exist in Files
    })
  })

  describe("Create file directory, delete file directory, edit file directory settings in Files", () => {
    beforeEach(() => {
      cy.setSessionDefaults()
      cy.setupDefaultInterceptors()

      cy.visit(
        `/sites/${TEST_REPO_NAME}/media/files/mediaDirectory/files`
      ).wait(Interceptors.GET)
      cy.contains("Verify").should("not.exist")
    })

    it("Should be able to create new file directory", () => {
      cy.contains("Create directory").click()
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
      cy.clickContextMenuItem("@folderItem", "settings").wait(Interceptors.GET)
      cy.get("#newDirectoryName").clear().type(OTHER_DIRECTORY_TITLE)
      cy.contains("button", "Save").click().wait(Interceptors.POST)

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
      cy.setSessionDefaults()

      cy.visit(`/sites/${TEST_REPO_NAME}/media/files/mediaDirectory/files`)
      cy.contains("Create directory").click()
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
      cy.setSessionDefaults()
      cy.setupDefaultInterceptors()
      cy.visit(
        `/sites/${TEST_REPO_NAME}/media/files/mediaDirectory/files%2F${DIRECTORY_TITLE}`
      )
      cy.contains("Verify").should("not.exist")
    })

    it("Should be able to add file to file directory", () => {
      cy.uploadMedia(FILE_TITLE, TEST_FILE_PATH)

      // ASSERTS
      cy.contains("Media file successfully uploaded").should("exist")
      cy.contains(FILE_TITLE).should("exist") // file should be contained in Files
    })

    it("Should be able to edit an file in file directory", () => {
      cy.contains(FILE_TITLE).should("exist")
      cy.renameDirectoryMedia(FILE_TITLE, OTHER_FILE_TITLE)

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
