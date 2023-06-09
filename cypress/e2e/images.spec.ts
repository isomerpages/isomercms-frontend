import "cypress-file-upload"

import { TEST_REPO_NAME, Interceptors } from "../fixtures/constants"

describe("Images", () => {
  const IMAGE_TITLE = "singapore"
  const OTHER_IMAGE_TITLE = "america"
  const TEST_IMAGE_PATH = "images/singapore.jpg"

  const ALBUM_TITLE = "Purple"
  const OTHER_ALBUM_TITLE = "Orange"
  const ANOTHER_ALBUM_TITLE = "Green"

  before(() => {
    cy.setGithubSessionDefaults()
    cy.setupDefaultInterceptors()

    cy.visit(
      `/sites/${TEST_REPO_NAME}/media/images/mediaDirectory/images`
    ).wait(Interceptors.GET)
    cy.contains("Create album").click()
    cy.get("#newDirectoryName").clear().type(ALBUM_TITLE)
    cy.get("button")
      .contains(/^Next$/)
      .click()

    cy.get("button")
      .contains(/^Skip$/)
      .click()
      .wait(Interceptors.POST)

    // Assert
    cy.contains(ALBUM_TITLE).should("exist")
  })

  describe("Create album, delete album, edit album settings in Images", () => {
    beforeEach(() => {
      cy.setGithubSessionDefaults()
      cy.setupDefaultInterceptors()

      cy.visit(
        `/sites/${TEST_REPO_NAME}/media/images/mediaDirectory/images%2F${ALBUM_TITLE}`
      ).wait(Interceptors.GET)
    })

    it("Should be able to create new album", () => {
      cy.contains("Create album").click()
      cy.get("#newDirectoryName").clear().type(OTHER_ALBUM_TITLE)

      cy.get("button")
        .contains(/^Next$/)
        .click()

      cy.get("button")
        .contains(/^Skip$/)
        .click()
        .should("not.exist")
        .wait(Interceptors.POST)

      // Assert
      cy.contains(OTHER_ALBUM_TITLE).should("exist") // Directory name should exist
    })

    it("Should be able to edit album name", () => {
      // Set up file in album to be renamed
      cy.visit(
        `/sites/${TEST_REPO_NAME}/media/images/mediaDirectory/images%2F${ALBUM_TITLE}%2F${OTHER_ALBUM_TITLE}`
      ).wait(Interceptors.GET)
      cy.uploadMedia(IMAGE_TITLE, TEST_IMAGE_PATH)
      cy.contains(IMAGE_TITLE).should("exist")
      cy.visit(
        `/sites/${TEST_REPO_NAME}/media/images/mediaDirectory/images%2F${ALBUM_TITLE}`
      ).wait(Interceptors.GET)

      // User should be able edit album details
      cy.contains("div", OTHER_ALBUM_TITLE)
        .parent()
        .parent()
        .parent()
        .should("exist")
        .as("folderItem")
      cy.clickContextMenuItem("@folderItem", "settings").wait(Interceptors.GET)
      cy.get("#newDirectoryName").clear().type(ANOTHER_ALBUM_TITLE)
      cy.contains("button", "Save").click().wait(Interceptors.POST)

      // Assert
      cy.contains(ANOTHER_ALBUM_TITLE).should("exist") // New file directory name should be contained in Files
      cy.visit(
        `/sites/${TEST_REPO_NAME}/media/images/mediaDirectory/images%2F${ALBUM_TITLE}%2F${ANOTHER_ALBUM_TITLE}`
      ).wait(Interceptors.GET)
      cy.contains(IMAGE_TITLE).should("exist")
    })

    it("Should be able to delete album", () => {
      // User should be able delete directory
      cy.contains("div", ANOTHER_ALBUM_TITLE)
        .parent()
        .parent()
        .parent()
        .should("exist")
        .as("folderItem")
      cy.clickContextMenuItem("@folderItem", "Delete")
      cy.contains("button", "delete")
        .click()
        .should("not.exist")
        .wait(Interceptors.DELETE)

      // Assert
      cy.contains(ANOTHER_ALBUM_TITLE).should("not.exist") // Directory name should not be contained in Files
    })
  })
  describe("Create image, delete image, edit image settings, and move images in image albums", () => {
    before(() => {
      cy.setGithubSessionDefaults()
      cy.setupDefaultInterceptors()
      cy.visit(
        `/sites/${TEST_REPO_NAME}/media/images/mediaDirectory/images%2F${ALBUM_TITLE}`
      ).wait(Interceptors.GET)
      cy.contains("Create album").click()
      cy.get("#newDirectoryName").clear().type(OTHER_ALBUM_TITLE)
      cy.get("button")
        .contains(/^Next$/)
        .click()

      cy.get("button")
        .contains(/^Skip$/)
        .click()
        .wait(Interceptors.POST)

      // Assert
      cy.contains(OTHER_ALBUM_TITLE).should("exist")
    })

    beforeEach(() => {
      cy.setupDefaultInterceptors()
      cy.setGithubSessionDefaults()

      cy.visit(
        `/sites/${TEST_REPO_NAME}/media/images/mediaDirectory/images%2F${ALBUM_TITLE}`
      ).wait(Interceptors.GET)
    })

    it("Should be able to add image to image album", () => {
      cy.uploadMedia(IMAGE_TITLE, TEST_IMAGE_PATH)

      // Assert
      cy.contains("Media file successfully uploaded").should("exist")
      cy.contains(IMAGE_TITLE).should("exist") // image should be contained in Images
    })

    it("Should be able to edit an image in image album", () => {
      cy.contains(IMAGE_TITLE).should("exist")
      cy.renameDirectoryMedia(IMAGE_TITLE, OTHER_IMAGE_TITLE)

      // Assert
      cy.contains(OTHER_IMAGE_TITLE).should("exist") // Image should be contained in Images
    })

    it("Should be able to delete image from image album", () => {
      cy.contains("button", OTHER_IMAGE_TITLE)
        .as("imagePreview")
        .should("exist")
      cy.clickContextMenuItem("@imagePreview", "Delete image")
      cy.contains("button", "delete").click().wait(Interceptors.DELETE)

      // Assert
      cy.contains(OTHER_IMAGE_TITLE).should("not.exist") // Image file name should not exist in Images
    })

    it("Should be able to navigate between different image albums", () => {
      // Set up image
      cy.uploadMedia(IMAGE_TITLE, TEST_IMAGE_PATH)
      cy.contains("Media file successfully uploaded").should("exist")

      cy.contains("button", IMAGE_TITLE).as("imagePreview").should("exist")
      cy.clickContextMenuItem("@imagePreview", "Move to")

      cy.contains(`Move Here`)

      cy.get("u").first().getFirstSiblingAs("currentLocationBreadcrumb")
      cy.verifyBreadcrumb("@currentLocationBreadcrumb", [
        "Workspace",
        "Images",
        ALBUM_TITLE,
        IMAGE_TITLE,
      ])
      cy.get("u").last().getFirstSiblingAs("movedLocationBreadcrumb")
      cy.verifyBreadcrumb("@movedLocationBreadcrumb", [
        "Workspace",
        "Images",
        ALBUM_TITLE,
        IMAGE_TITLE,
      ])

      // Navigate to Orange subfolder
      cy.get("button[id^=moveModal-forwardButton-]").click({ force: true })

      cy.get("u").first().getFirstSiblingAs("moveFolderCurrentBreadcrumb")
      cy.verifyBreadcrumb("@moveFolderCurrentBreadcrumb", [
        "Workspace",
        "Images",
        ALBUM_TITLE,
        IMAGE_TITLE,
      ])
      cy.get("u").last().getFirstSiblingAs("moveFolderUpdatedBreadcrumb")
      cy.verifyBreadcrumb("@moveFolderUpdatedBreadcrumb", [
        "Workspace",
        "Images",
        ALBUM_TITLE,
        OTHER_ALBUM_TITLE,
        IMAGE_TITLE,
      ])

      // Navigate to Purple folder
      cy.get("#moveModal-backButton").click({ force: true })

      cy.get("u").first().getFirstSiblingAs("moveFolderCurrentBreadcrumb")
      cy.verifyBreadcrumb("@moveFolderCurrentBreadcrumb", [
        "Workspace",
        "Images",
        ALBUM_TITLE,
        IMAGE_TITLE,
      ])
      cy.get("u").last().getFirstSiblingAs("moveFolderUpdatedBreadcrumb")
      cy.verifyBreadcrumb("@moveFolderUpdatedBreadcrumb", [
        "Workspace",
        "Images",
        ALBUM_TITLE,
        IMAGE_TITLE,
      ])

      // Navigate to Images
      cy.get("#moveModal-backButton").click({ force: true })

      cy.get("u").first().getFirstSiblingAs("workspaceCurrentBreadcrumb")
      cy.verifyBreadcrumb("@workspaceCurrentBreadcrumb", [
        "Workspace",
        "Images",
        ALBUM_TITLE,
        IMAGE_TITLE,
      ])
      cy.get("u").last().getFirstSiblingAs("workspaceUpdatedBreadcrumb")
      cy.verifyBreadcrumb("@workspaceUpdatedBreadcrumb", [
        "Workspace",
        "Images",
        IMAGE_TITLE,
      ])
    })

    it("Should be able to move image to different image album", () => {
      cy.contains("button", IMAGE_TITLE).as("imagePreview").should("exist")
      cy.clickContextMenuItem("@imagePreview", "Move to")

      // Navigate to Orange subfolder
      cy.get("button[id^=moveModal-forwardButton-]").click({ force: true })

      cy.contains("button", "Move Here").click().wait(Interceptors.POST)

      // Assert
      cy.visit(
        `/sites/${TEST_REPO_NAME}/media/images/mediaDirectory/images%2F${ALBUM_TITLE}%2F${OTHER_ALBUM_TITLE}`
      ).wait(Interceptors.GET)
      cy.contains(IMAGE_TITLE).should("exist") // Image should be contained in Orange
    })
  })
})
