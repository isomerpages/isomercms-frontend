import "cypress-file-upload"
import { SUCCESSFUL_EDIT_PAGE_TOAST } from "hooks/pageHooks/useUpdatePageHook"

import {
  slugifyCategory,
  generateResourceFileName,
  titleToPageFileName,
} from "utils/fileNameUtils"

import {
  CMS_BASEURL,
  Interceptors,
  TEST_REPO_NAME,
} from "../fixtures/constants"

// Constants
const PRIMARY_COLOUR = "rgb(255, 0, 0)"
const SECONDARY_COLOUR = "rgb(0, 255, 0)"

describe("editPage.spec", () => {
  beforeEach(() => {
    cy.setupDefaultInterceptors()
    cy.setGithubSessionDefaults()
  })

  describe("Edit resource page", () => {
    const TEST_CATEGORY = "Test Edit Resource Category"
    const TEST_CATEGORY_SLUGIFIED = slugifyCategory(TEST_CATEGORY)
    const TEST_RESOURCE_ROOM = "resources"
    const TEST_PAGE_TITLE = "Test Resource Page"
    const TEST_PAGE_DATE = "2021-05-17"

    before(() => {
      cy.setDefaultSettings()

      // NOTE: We need to repeat the interceptor here as
      // cypress resolves by type before nesting level.
      // Hence, the alias here will not be resolved as the `before` hook
      // will be resolved before the outer `beforeEach`
      cy.setupDefaultInterceptors()

      // Set up test resource categories
      // Set up test resource category
      cy.visit(
        `/sites/${TEST_REPO_NAME}/resourceRoom/${TEST_RESOURCE_ROOM}`
      ).wait(Interceptors.GET)
      cy.contains("Create category").should("be.visible").click()
      cy.get('input[placeholder="Title"]').type(TEST_CATEGORY)
      cy.contains("Next").click()

      cy.wait(Interceptors.POST)

      // Set up test resource page
      cy.visit(
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/resourceRoom/${TEST_RESOURCE_ROOM}/resourceCategory/${TEST_CATEGORY_SLUGIFIED}`
      )
      cy.contains("Create page")
        .should("be.visible")
        .click()
        .wait(Interceptors.GET)

      cy.get('input[id="title"]').clear().type(TEST_PAGE_TITLE)
      cy.get('input[id="date"]').clear().type(TEST_PAGE_DATE)
      cy.contains("Save").click().wait(Interceptors.POST)
    })

    beforeEach(() => {
      cy.visit(
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/resourceRoom/${TEST_RESOURCE_ROOM}/resourceCategory/${TEST_CATEGORY_SLUGIFIED}/editPage/${generateResourceFileName(
          encodeURIComponent(TEST_PAGE_TITLE),
          TEST_PAGE_DATE,
          true
        )}`
      )
      cy.contains("Verify").should("not.exist")
    })

    it("Edit page (resource) should have correct colour", () => {
      cy.get("#display-header").should(
        "have.css",
        "background-color",
        SECONDARY_COLOUR
      )
    })
  })
})
