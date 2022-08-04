import "cypress-file-upload"
import {
  slugifyCategory,
  generateResourceFileName,
  titleToPageFileName,
} from "utils"

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
    cy.setSessionDefaults()
  })

  describe("Edit unlinked page", () => {
    const TEST_PAGE_CONTENT = "lorem ipsum"

    const TEST_UNLINKED_PAGE_TITLE = "Test Unlinked Page"
    const TEST_UNLINKED_PAGE_FILENAME = titleToPageFileName(
      TEST_UNLINKED_PAGE_TITLE
    )
    const TEST_PAGE_TITLE_ENCODED = encodeURIComponent(
      TEST_UNLINKED_PAGE_FILENAME
    )

    const DEFAULT_IMAGE_TITLE = "isomer-logo.svg"
    const ADDED_IMAGE_TITLE = "balloon.png"
    const ADDED_IMAGE_PATH = "images/balloon.png"

    const ADDED_FILE_TITLE = "singapore-pages.pdf"
    const ADDED_FILE_PATH = "files/singapore.pdf"

    const LINK_TITLE = "link"
    const LINK_URL = "https://www.google.com"

    before(() => {
      cy.setDefaultPrimaryColour()

      // NOTE: We need to repeat the interceptor here as
      // cypress resolves by type before nesting level.
      // Hence, the alias here will not be resolved as the `before` hook
      // will be resolved before the outer `beforeEach`
      cy.setupDefaultInterceptors()

      // Set up test resource categories
      cy.visit(`/sites/${TEST_REPO_NAME}/workspace`)
      cy.contains("button", "Create page").click()
      cy.get("#title").clear().type(TEST_UNLINKED_PAGE_TITLE)
      cy.contains("Save").click().wait(Interceptors.POST)
    })

    beforeEach(() => {
      cy.visit(`/sites/${TEST_REPO_NAME}/editPage/${TEST_PAGE_TITLE_ENCODED}`)
      cy.contains("verify").should("not.exist")
    })

    it("Edit page (unlinked) should have correct colour", () => {
      cy.get("#display-header").should(
        "have.css",
        "background-color",
        PRIMARY_COLOUR
      )
    })

    it("Edit page (unlinked) should have name of title", () => {
      cy.contains(TEST_UNLINKED_PAGE_TITLE)
    })

    it("Edit page (unlinked) should provide a warning to users when navigating away", () => {
      cy.get(".CodeMirror-scroll").type(TEST_PAGE_CONTENT)
      cy.contains(":button", "Back to Workspace").click()

      cy.contains("Warning")
      cy.contains(":button", "No").click()

      // Sanity check: still in unlinked pages and content still present
      cy.url().should(
        "include",
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/editPage/${TEST_PAGE_TITLE_ENCODED}`
      )
      cy.contains(TEST_PAGE_CONTENT)

      cy.contains(":button", "Back to Workspace").click()

      cy.contains("Warning")
      cy.contains(":button", "Yes").click()

      // Assert: in Workspace
      cy.url().should(
        "include",
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/workspace`
      )
    })

    it("Edit page (unlinked) should allow user to modify and save content", () => {
      cy.get(".CodeMirror-scroll").type(TEST_PAGE_CONTENT)
      cy.contains(":button", "Save").click()

      // Asserts
      // 1. Toast
      cy.contains("Successfully updated page")

      // 2. Content is there even after refreshing
      cy.reload()
      cy.contains(TEST_PAGE_CONTENT).should("exist")
    })

    it("Edit page (unlinked) should allow user to add existing image", () => {
      cy.get(".image").click().wait(Interceptors.GET)
      cy.contains(DEFAULT_IMAGE_TITLE).click()
      cy.contains(":button", "Select").click()

      cy.get("#altText").clear().type("Hello World")
      cy.contains(":button", "Save").click()

      cy.contains(`/images/${DEFAULT_IMAGE_TITLE}`)
    })

    it("Edit page (unlinked) should allow user to upload and add new image", () => {
      cy.get(".image").click().wait(Interceptors.GET)
      cy.contains(":button", "Add new").click()

      cy.get("#file-upload").attachFile(ADDED_IMAGE_PATH)
      cy.get("#name").clear().type(ADDED_IMAGE_TITLE)
      cy.get("button")
        .contains(/^Upload$/)
        .click()
        .wait(Interceptors.POST)

      cy.contains(":button", "Select").click()

      cy.get("#altText").clear().type("Hello World")
      cy.contains(":button", "Save").click()

      cy.contains(`/images/${ADDED_IMAGE_TITLE}`)
    })

    it("Edit page (unlinked) should allow user to upload and add new file", () => {
      cy.get(".file").click().wait(Interceptors.GET)
      cy.contains(":button", "Add new").click()

      cy.get("#file-upload").attachFile(ADDED_FILE_PATH)
      cy.get("#name").clear().type(ADDED_FILE_TITLE)
      cy.get("button")
        .contains(/^Upload$/)
        .click()
        .wait(Interceptors.POST)

      cy.contains(":button", "Select").click()

      cy.get("#altText").clear().type("Hello World")
      cy.contains(":button", "Save").click()

      cy.contains(`/files/${ADDED_FILE_TITLE}`)
    })

    it("Edit page (unlinked) should allow user to add existing file", () => {
      cy.get(".file").click().wait(Interceptors.GET)
      cy.contains(ADDED_FILE_TITLE).click()
      cy.contains(":button", "Select").click()

      cy.get("#altText").clear().type("Hello World")
      cy.contains(":button", "Save").click()
      cy.contains(`/files/${ADDED_FILE_TITLE}`)
    })

    it("Edit page (unlinked) should allow user to add link", () => {
      cy.get(".link").click()

      cy.get('input[id="text"]').type(LINK_TITLE)
      cy.get('input[id="link"]').type(LINK_URL)
      cy.contains(":button", "Save").click()

      cy.contains(`[${LINK_TITLE}](${LINK_URL})`)
    })
  })

  describe("Edit collection page", () => {
    const TEST_FOLDER_TITLE = "Test Edit Collection Category"
    const TEST_FOLDER_TITLE_SLUGIFIED = slugifyCategory(TEST_FOLDER_TITLE)

    const TEST_PAGE_TITLE = "Test Collection Page"
    const TEST_PAGE_FILENAME = titleToPageFileName(TEST_PAGE_TITLE)
    const TEST_PAGE_TITLE_ENCODED = encodeURIComponent(TEST_PAGE_FILENAME)

    const TEST_PAGE_CONTENT = "lorem ipsum"

    const DEFAULT_IMAGE_TITLE = "isomer-logo.svg"

    const ADDED_FILE_TITLE = "singapore-pages.pdf"

    const LINK_TITLE = "link"
    const LINK_URL = "https://www.google.com"

    before(() => {
      cy.setSessionDefaults()

      // Set up test resource categories
      // NOTE: We need to repeat the interceptor here as
      // cypress resolves by type before nesting level.
      // Hence, the alias here will not be resolved as the `before` hook
      // will be resolved before the outer `beforeEach`
      cy.setupDefaultInterceptors()

      // Set up test collection
      cy.visit(`/sites/${TEST_REPO_NAME}/workspace`)
      cy.contains("Create folder").should("exist").click()
      cy.get("input#newDirectoryName").clear().type(TEST_FOLDER_TITLE)
      cy.contains("Next").click()
      cy.contains("Skip").click()

      cy.wait(Interceptors.POST)

      // Set up test collection page
      cy.visit(
        `/sites/${TEST_REPO_NAME}/folders/${TEST_FOLDER_TITLE_SLUGIFIED}`
      )
      cy.contains("Create page").should("exist").click()
      cy.get("#title").clear().type(TEST_PAGE_TITLE)
      cy.contains("Save").click()

      cy.wait(Interceptors.POST)
    })

    beforeEach(() => {
      cy.visit(
        `/sites/${TEST_REPO_NAME}/folders/${TEST_FOLDER_TITLE_SLUGIFIED}/editPage/${TEST_PAGE_TITLE_ENCODED}`
      ).wait(Interceptors.GET)
    })

    it("Edit page (collection) should have correct colour", () => {
      cy.get("#display-header").should(
        "have.css",
        "background-color",
        PRIMARY_COLOUR
      )
    })

    it("Edit page (collection) should have name of title", () => {
      cy.contains(TEST_PAGE_TITLE)
    })

    it("Edit page (collection) should have third nav menu", () => {
      cy.get("#sidenav").contains(TEST_PAGE_TITLE).should("exist")
    })

    it("Edit page (collection) should provide a warning to users when navigating away", () => {
      cy.get(".CodeMirror-scroll").type(TEST_PAGE_CONTENT)
      cy.contains(":button", TEST_FOLDER_TITLE).click()

      cy.contains("Warning")
      cy.contains(":button", "No").click()

      // Sanity check: still in edit collection pages and content still present
      cy.url().should(
        "include",
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folders/${TEST_FOLDER_TITLE_SLUGIFIED}/editPage/${TEST_PAGE_TITLE_ENCODED}`
      )
      cy.contains(TEST_PAGE_CONTENT)

      cy.contains(":button", TEST_FOLDER_TITLE).click()

      cy.contains("Warning")
      cy.contains(":button", "Yes").click()

      // Assert: in Collection folder
      cy.url().should(
        "include",
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folders/${TEST_FOLDER_TITLE_SLUGIFIED}`
      )
    })

    it("Edit page (collection) should allow user to modify and save content", () => {
      cy.get(".CodeMirror-scroll").type(TEST_PAGE_CONTENT)
      cy.contains(":button", "Save").click()

      // Asserts
      // 1. Toast
      cy.contains("Successfully updated page")

      // 2. Content is there even after refreshing
      cy.reload()
      cy.contains(TEST_PAGE_CONTENT).should("exist")
    })

    it("Edit page (collection) should allow user to add existing image", () => {
      cy.get(".image").click()
      cy.contains(DEFAULT_IMAGE_TITLE).click()
      cy.contains(":button", "Select").click()

      cy.get("#altText").clear().type("Hello World")
      cy.contains(":button", "Save").click()
      cy.contains(`/images/${DEFAULT_IMAGE_TITLE}`)
    })

    it("Edit page (collection) should allow user to add existing file", () => {
      cy.get(".file").click()
      cy.contains(ADDED_FILE_TITLE).click()
      cy.contains(":button", "Select").click()

      cy.get("#altText").clear().type("Hello World")
      cy.contains(":button", "Save").click()
      cy.contains(`/files/${ADDED_FILE_TITLE}`)
    })

    it("Edit page (collection) should allow user to add link", () => {
      cy.get(".link").click()

      cy.get('input[id="text"]').type(LINK_TITLE)
      cy.get('input[id="link"]').type(LINK_URL)
      cy.contains(":button", "Save").click()

      cy.contains(`[${LINK_TITLE}](${LINK_URL})`)
    })
  })

  describe("Edit resource page", () => {
    const TEST_CATEGORY = "Test Edit Resource Category"
    const TEST_CATEGORY_SLUGIFIED = slugifyCategory(TEST_CATEGORY)
    const TEST_RESOURCE_ROOM = "resources"
    const TEST_PAGE_TITLE = "Test Resource Page"
    const TEST_PAGE_DATE = "2021-05-17"

    before(() => {
      cy.setDefaultPrimaryColour()

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
      cy.contains("Create category").click()
      cy.get('input[placeholder="Title"]').type(TEST_CATEGORY)
      cy.contains("Next").click()

      cy.wait(Interceptors.POST)

      // Set up test resource page
      cy.visit(
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/resourceRoom/${TEST_RESOURCE_ROOM}/resourceCategory/${TEST_CATEGORY_SLUGIFIED}`
      )
      cy.contains("Create page").click().wait(Interceptors.GET)

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
