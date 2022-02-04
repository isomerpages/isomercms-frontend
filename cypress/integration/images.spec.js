import "cypress-file-upload"
import { generateImageorFilePath, slugifyCategory } from "../../src/utils"

describe("Images", () => {
  Cypress.config("baseUrl", Cypress.env("BASEURL"))
  const COOKIE_NAME = Cypress.env("COOKIE_NAME")
  const COOKIE_VALUE = Cypress.env("COOKIE_VALUE")
  const TEST_REPO_NAME = Cypress.env("TEST_REPO_NAME")
  const CUSTOM_TIMEOUT = Cypress.env("CUSTOM_TIMEOUT")

  const IMAGE_TITLE = "singapore.jpg"
  const OTHER_IMAGE_TITLE = "america.jpg"
  const EXISTING_IMAGE_TITLE = "favicon-isomer.ico"
  const TEST_IMAGE_PATH = "images/singapore.jpg"

  const ALBUM_TITLE = "Purple"
  const OTHER_ALBUM_TITLE = "Green"

  const MISSING_EXTENSION = "singapore"
  const INVALID_CHARACTER = "%%%%.png"
  const ACTION_DISABLED = "true"

  // describe("Create image, delete image, edit image settings in Images", () => {
  //   beforeEach(() => {
  //     cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
  //     window.localStorage.setItem("userId", "test")

  //     cy.visit(`/sites/${TEST_REPO_NAME}/media/images/mediaDirectory/images`)
  //     cy.wait(2000)
  //   })

  //   it("Images should contain albums and ungrouped images", () => {
  //     cy.contains("Albums")
  //     cy.contains("Ungrouped images")
  //     cy.contains("Upload new image")
  //     cy.contains("Create new album")
  //   })

  //   it("Should be able to create new image with valid title", () => {
  //     // Set intercept to listen for POST request on server
  //     cy.intercept({
  //       method: "POST",
  //       url: `/v2/sites/${TEST_REPO_NAME}/media/images/pages`,
  //     }).as("createImage")

  //     cy.uploadMedia(IMAGE_TITLE, TEST_IMAGE_PATH)
  //     // ASSERTS
  //     cy.wait("@createImage", { timeout: CUSTOM_TIMEOUT }) // should intercept POST request
  //     cy.contains(IMAGE_TITLE, { timeout: CUSTOM_TIMEOUT }).should("exist") // image should be contained in Images
  //   })

  //   it("Should be able to edit an image", () => {
  //     // Set intercept to listen for POST request on server
  //     cy.intercept({
  //       method: "POST",
  //       url: `/v2/sites/${TEST_REPO_NAME}/media/images/pages/${IMAGE_TITLE}`,
  //     }).as("renameImage")
  //     cy.renameMedia(IMAGE_TITLE, OTHER_IMAGE_TITLE)
  //     // ASSERTS
  //     cy.wait("@renameImage", { timeout: CUSTOM_TIMEOUT })
  //     cy.contains(OTHER_IMAGE_TITLE, { timeout: CUSTOM_TIMEOUT }).should(
  //       "exist"
  //     ) // Image should be contained in Images
  //   })

  //   it("Should not be able to create image with invalid title", () => {
  //     // should not be able to save with invalid characters in title
  //     cy.uploadMedia(INVALID_CHARACTER, TEST_IMAGE_PATH, ACTION_DISABLED)
  //     // ASSERTS
  //     cy.contains(
  //       "Title cannot contain any of the following special characters"
  //     )
  //     cy.get("button")
  //       .contains(/^Upload$/)
  //       .should("be.disabled") // necessary as multiple buttons containing Upload on page
  //     cy.get("#closeMediaSettingsModal").click()

  //     // title should not allow for names without extensions
  //     cy.uploadMedia(MISSING_EXTENSION, TEST_IMAGE_PATH, ACTION_DISABLED)
  //     // ASSERTS
  //     cy.contains("Title must end with one of the following extensions")
  //     cy.get("button")
  //       .contains(/^Upload$/)
  //       .should("be.disabled") // necessary as multiple buttons containing Upload on page
  //     cy.get("#closeMediaSettingsModal").click()

  //     // users should not be able to create file with duplicated filename in folder
  //     cy.uploadMedia(OTHER_IMAGE_TITLE, TEST_IMAGE_PATH, ACTION_DISABLED)
  //     // ASSERTS
  //     cy.contains("Title is already in use. Please choose a different title.")
  //     cy.get("button")
  //       .contains(/^Upload$/)
  //       .should("be.disabled") // necessary as multiple buttons containing Upload on page
  //   })

  //   it("Should not be able to edit image and save with invalid title", () => {
  //     // should not be able to save with invalid characters in title
  //     cy.renameMedia(OTHER_IMAGE_TITLE, INVALID_CHARACTER, ACTION_DISABLED)
  //     // ASSERTS
  //     cy.contains(
  //       "Title cannot contain any of the following special characters"
  //     )
  //     cy.get("button")
  //       .contains(/^Save$/)
  //       .should("be.disabled") // necessary as multiple buttons containing Upload on page
  //     cy.get("#closeMediaSettingsModal").click()

  //     // title should not allow for names without extensions
  //     cy.renameMedia(OTHER_IMAGE_TITLE, MISSING_EXTENSION, ACTION_DISABLED)
  //     // ASSERTS
  //     cy.contains("Title must end with one of the following extensions")
  //     cy.get("button")
  //       .contains(/^Save$/)
  //       .should("be.disabled") // necessary as multiple buttons containing Upload on page
  //     cy.get("#closeMediaSettingsModal").click()

  //     cy.renameMedia(OTHER_IMAGE_TITLE, EXISTING_IMAGE_TITLE, ACTION_DISABLED)
  //     // ASSERTS
  //     cy.contains("Title is already in use. Please choose a different title.")
  //     cy.get("button")
  //       .contains(/^Save$/)
  //       .should("be.disabled") // necessary as multiple buttons containing Upload on page
  //   })

  //   it("Should be able to delete image", () => {
  //     cy.deleteMedia(OTHER_IMAGE_TITLE)
  //     // ASSERTS
  //     cy.contains(OTHER_IMAGE_TITLE).should("not.exist") // Image file name should not exist in Images
  //   })
  // })

  // describe("Create image album, delete image album, edit image album settings in Images", () => {
  //   beforeEach(() => {
  //     cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
  //     window.localStorage.setItem("userId", "test")

  //     cy.visit(`/sites/${TEST_REPO_NAME}/media/images/mediaDirectory/images`)
  //     cy.wait(2000)
  //   })

  //   it("Should be able to create new image album", () => {
  //     cy.contains("Create new album").click()
  //     cy.get("#newDirectoryName").clear().type(ALBUM_TITLE)

  //     cy.get("button")
  //       .contains(/^Next$/)
  //       .click()

  //     cy.get("button")
  //       .contains(/^Skip$/)
  //       .click()

  //     // ASSERTS
  //     cy.wait(2000)
  //     cy.contains(ALBUM_TITLE, { timeout: CUSTOM_TIMEOUT }).should("exist") // Album name should be contained in Images
  //   })

  //   it("Should be able to edit image album name", () => {
  //     // User should be able edit album details
  //     const testAlbumCard = cy
  //       .contains(ALBUM_TITLE, { timeout: CUSTOM_TIMEOUT })
  //       .should("exist")
  //     testAlbumCard.children().within(() => cy.get("[id^=settings-]").click())
  //     cy.get("div[id^=settings-]").first().click() // .first() is necessary because the get returns multiple elements (refer to MenuDropdown.jsx)
  //     cy.get("#newDirectoryName").clear().type(OTHER_ALBUM_TITLE)
  //     cy.contains("button", "Save").click()
  //     cy.wait(4000)
  //     // ASSERTS
  //     cy.contains(OTHER_ALBUM_TITLE, { timeout: CUSTOM_TIMEOUT }).should(
  //       "exist"
  //     ) // New image album name should be contained in Images
  //   })

  //   it("Should be able to delete image album", () => {
  //     // User should be able delete album
  //     const testAlbumCard = cy
  //       .contains(OTHER_ALBUM_TITLE, { timeout: CUSTOM_TIMEOUT })
  //       .should("exist")
  //     testAlbumCard.children().within(() => cy.get("[id^=settings-]").click())
  //     cy.get("div[id^=delete-]").first().click() // .first() is necessary because the get returns multiple elements (refer to MenuDropdown.jsx)
  //     cy.contains("button", "Delete").click()
  //     cy.wait(4000)
  //     // ASSERTS
  //     cy.contains(OTHER_ALBUM_TITLE, { timeout: CUSTOM_TIMEOUT }).should(
  //       "not.exist"
  //     ) // Album name should not be contained in Images
  //   })
  // })

  describe("Create image, delete image, edit image settings, and move images in image albums", () => {
    before(() => {
      cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
      window.localStorage.setItem("userId", "test")

      cy.visit(`/sites/${TEST_REPO_NAME}/media/images/mediaDirectory/images`)
      cy.contains("Create new album").click()
      cy.get("#newDirectoryName").clear().type(ALBUM_TITLE)
      cy.get("button")
        .contains(/^Next$/)
        .click()

      cy.get("button")
        .contains(/^Skip$/)
        .click()

      // Assert
      cy.wait(2000)
      cy.contains(ALBUM_TITLE, { timeout: CUSTOM_TIMEOUT }).should("exist")
    })

    beforeEach(() => {
      cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
      window.localStorage.setItem("userId", "test")

      cy.visit(
        `/sites/${TEST_REPO_NAME}/media/images/mediaDirectory/images%2F${ALBUM_TITLE}`
      )
    })

    it("Should be able to add image to image album", () => {
      cy.uploadMedia(IMAGE_TITLE, TEST_IMAGE_PATH)
      // ASSERTS
      cy.wait(2000)
      cy.contains("Media file successfully uploaded", {
        timeout: CUSTOM_TIMEOUT,
      }).should("exist")
      cy.contains(IMAGE_TITLE, { timeout: CUSTOM_TIMEOUT }).should("exist") // image should be contained in Images
    })

    it("Should be able to edit an image in image album", () => {
      cy.contains(IMAGE_TITLE, { timeout: CUSTOM_TIMEOUT }).should("exist")
      cy.renameMedia(IMAGE_TITLE, OTHER_IMAGE_TITLE)
      // ASSERTS
      cy.wait(2000)
      cy.contains(OTHER_IMAGE_TITLE, { timeout: CUSTOM_TIMEOUT }).should(
        "exist"
      ) // Image should be contained in Images
    })

    it("Should be able to delete image from image album", () => {
      cy.contains(OTHER_IMAGE_TITLE, { timeout: CUSTOM_TIMEOUT }).should(
        "exist"
      )
      cy.deleteMedia(OTHER_IMAGE_TITLE)
      // ASSERTS
      cy.contains(OTHER_IMAGE_TITLE, { timeout: CUSTOM_TIMEOUT }).should(
        "not.exist"
      ) // Image file name should not exist in Images
    })
  })
})
