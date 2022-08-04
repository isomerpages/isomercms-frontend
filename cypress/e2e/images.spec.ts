import "cypress-file-upload"

import { TEST_REPO_NAME, Interceptors } from "../fixtures/constants"

describe("Images", () => {
  const IMAGE_TITLE = "singapore.jpg"
  const OTHER_IMAGE_TITLE = "america.jpg"
  const TEST_IMAGE_PATH = "images/singapore.jpg"

  const ALBUM_TITLE = "Purple"

  describe("Create image, delete image, edit image settings, and move images in image albums", () => {
    before(() => {
      cy.setSessionDefaults()
      cy.setupDefaultInterceptors()

      cy.visit(`/sites/${TEST_REPO_NAME}/media/images/mediaDirectory/images`)
      cy.contains("Create new album").click()
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

    beforeEach(() => {
      cy.setupDefaultInterceptors()
      cy.setSessionDefaults()

      cy.visit(
        `/sites/${TEST_REPO_NAME}/media/images/mediaDirectory/images%2F${ALBUM_TITLE}`
      ).wait(Interceptors.GET)
    })

    it("Should be able to add image to image album", () => {
      cy.uploadMedia(IMAGE_TITLE, TEST_IMAGE_PATH).wait(Interceptors.POST)

      // ASSERTS
      cy.contains("Media file successfully uploaded").should("exist")
      cy.contains(IMAGE_TITLE).should("exist") // image should be contained in Images
    })

    it("Should be able to edit an image in image album", () => {
      cy.contains(IMAGE_TITLE).should("exist")
      cy.renameMedia(IMAGE_TITLE, OTHER_IMAGE_TITLE).wait(Interceptors.POST)

      // ASSERTS
      cy.contains(OTHER_IMAGE_TITLE).should("exist") // Image should be contained in Images
    })

    it("Should be able to delete image from image album", () => {
      cy.contains("button", OTHER_IMAGE_TITLE)
        .as("imagePreview")
        .should("exist")
      cy.clickContextMenuItem("@imagePreview", "Delete")
      cy.contains("button", "delete").click().wait(Interceptors.DELETE)

      // ASSERTS
      cy.contains(OTHER_IMAGE_TITLE).should("not.exist") // Image file name should not exist in Images
    })
  })
})
