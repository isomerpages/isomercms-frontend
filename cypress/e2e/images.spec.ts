import "cypress-file-upload"

import {
  E2E_EXTENDED_TIMEOUT,
  E2E_DEFAULT_WAIT_TIME,
} from "../fixtures/constants"

describe("Images", () => {
  Cypress.config("baseUrl", Cypress.env("BASEURL"))
  const COOKIE_NAME = Cypress.env("COOKIE_NAME")
  const COOKIE_VALUE = Cypress.env("COOKIE_VALUE")
  const TEST_REPO_NAME = Cypress.env("TEST_REPO_NAME")

  const IMAGE_TITLE = "singapore.jpg"
  const OTHER_IMAGE_TITLE = "america.jpg"
  const TEST_IMAGE_PATH = "images/singapore.jpg"

  const ALBUM_TITLE = "Purple"

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
      cy.wait(E2E_DEFAULT_WAIT_TIME)
      cy.contains(ALBUM_TITLE, { timeout: E2E_EXTENDED_TIMEOUT }).should(
        "exist"
      )
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
      cy.wait(E2E_DEFAULT_WAIT_TIME)
      cy.contains("Media file successfully uploaded", {
        timeout: E2E_EXTENDED_TIMEOUT,
      }).should("exist")
      cy.contains(IMAGE_TITLE, { timeout: E2E_EXTENDED_TIMEOUT }).should(
        "exist"
      ) // image should be contained in Images
    })

    it("Should be able to edit an image in image album", () => {
      cy.contains(IMAGE_TITLE, { timeout: E2E_EXTENDED_TIMEOUT }).should(
        "exist"
      )
      cy.renameMedia(IMAGE_TITLE, OTHER_IMAGE_TITLE)
      // ASSERTS
      cy.wait(E2E_DEFAULT_WAIT_TIME)
      cy.contains(OTHER_IMAGE_TITLE, { timeout: E2E_EXTENDED_TIMEOUT }).should(
        "exist"
      ) // Image should be contained in Images
    })

    it("Should be able to delete image from image album", () => {
      cy.contains("button", OTHER_IMAGE_TITLE, {
        timeout: E2E_EXTENDED_TIMEOUT,
      })
        .as("imagePreview")
        .should("exist")
      cy.clickContextMenuItem("@imagePreview", "Delete")
      cy.contains("button", "delete").click()
      // ASSERTS
      cy.contains(OTHER_IMAGE_TITLE, { timeout: E2E_EXTENDED_TIMEOUT }).should(
        "not.exist"
      ) // Image file name should not exist in Images
    })
  })
})
