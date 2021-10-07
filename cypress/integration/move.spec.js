import { titleToPageFileName, slugifyCategory } from "../../src/utils"

const CUSTOM_TIMEOUT = 30000 // 30 seconds

describe("Move flow", () => {
  const CMS_BASEURL = Cypress.env("BASEURL")
  const COOKIE_NAME = Cypress.env("COOKIE_NAME")
  const COOKIE_VALUE = Cypress.env("COOKIE_VALUE")
  const TEST_REPO_NAME = Cypress.env("TEST_REPO_NAME")

  const TEST_REPO_FOLDER_NAME = "Move Folder"
  const PARSED_TEST_REPO_FOLDER_NAME = slugifyCategory(TEST_REPO_FOLDER_NAME)

  const TEST_REPO_SUBFOLDER_NAME = "Move subfolder"
  const PARSED_TEST_REPO_SUBFOLDER_NAME = encodeURIComponent(
    TEST_REPO_SUBFOLDER_NAME
  )

  describe("Move pages out of Workspace", () => {
    const TITLE_WORKSPACE_TO_FOLDER = "Move from Workspace to folder"
    const FILENAME_WORKSPACE_TO_FOLDER = titleToPageFileName(
      TITLE_WORKSPACE_TO_FOLDER
    )

    const TITLE_WORKSPACE_TO_SUBFOLDER = "Move from Workspace to subfolder"
    const FILENAME_WORKSPACE_TO_SUBFOLDER = titleToPageFileName(
      TITLE_WORKSPACE_TO_SUBFOLDER
    )

    beforeEach(() => {
      cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
      window.localStorage.setItem("userId", "test")
      cy.visit(`${CMS_BASEURL}/sites/${TEST_REPO_NAME}/workspace`)
    })

    it("Should be able to navigate from Workspace to subfolder back to Workspace via MoveModal buttons", () => {
      cy.contains(FILENAME_WORKSPACE_TO_FOLDER).should("exist")
      cy.get(
        `button[id^="folderItem-dropdown-${FILENAME_WORKSPACE_TO_FOLDER}"]`
      ).click()
      cy.get("div[id^=move-]").first().click()
      cy.contains(`Move Page`)

      cy.contains(`Workspace > ${FILENAME_WORKSPACE_TO_FOLDER}`).should("exist")

      // Navigate to Move folder
      cy.get("i[id^=moveModal-forwardButton-]").eq(1).click({ force: true })
      cy.contains(
        `Workspace > ${TEST_REPO_FOLDER_NAME} > ${FILENAME_WORKSPACE_TO_FOLDER}`
      ).should("exist")

      // Navigate to Move subfolder
      cy.get("i[id^=moveModal-forwardButton-]").click({ force: true })
      cy.contains(
        `Workspace > ${TEST_REPO_FOLDER_NAME} > ${TEST_REPO_SUBFOLDER_NAME} > ${FILENAME_WORKSPACE_TO_FOLDER}`
      ).should("exist")

      // Navigate to Move folder
      cy.get("#moveModal-backButton").click({ force: true })
      cy.contains(
        `Workspace > ${TEST_REPO_FOLDER_NAME} > ${FILENAME_WORKSPACE_TO_FOLDER}`
      ).should("exist")

      // Navigate to Workspace
      cy.get("#moveModal-backButton").click({ force: true })
      cy.contains(`Workspace > ${FILENAME_WORKSPACE_TO_FOLDER}`).should("exist")
    })

    it("Should be able to move page from Workspace to itself and show correct success message", () => {
      cy.contains(FILENAME_WORKSPACE_TO_FOLDER).should("exist")
      cy.get(
        `button[id^="folderItem-dropdown-${FILENAME_WORKSPACE_TO_FOLDER}"]`
      ).click()
      cy.get("div[id^=move-]").first().click()
      cy.contains(`Move Page`)

      cy.contains("button", "Move Here").click()
      cy.contains("File is already in this folder", {
        timeout: CUSTOM_TIMEOUT,
      }).should("exist")
    })

    it("Should be able to move a page from Workspace to folder", () => {
      cy.contains(FILENAME_WORKSPACE_TO_FOLDER).should("exist")
      cy.get(
        `button[id^="folderItem-dropdown-${FILENAME_WORKSPACE_TO_FOLDER}"]`
      ).click()
      cy.get("div[id^=move-]").first().click()
      cy.contains(`Move Page`)

      // Assert
      cy.contains(`Workspace > ${FILENAME_WORKSPACE_TO_FOLDER}`)

      // Navigate to Move folder
      cy.get("i[id^=moveModal-forwardButton-]").eq(1).click({ force: true })

      // Assert
      cy.contains(
        `Workspace > ${TEST_REPO_FOLDER_NAME} > ${FILENAME_WORKSPACE_TO_FOLDER}`
      )

      cy.contains("button", "Move Here").click()
      cy.contains("Successfully moved file", {
        timeout: CUSTOM_TIMEOUT,
      }).should("exist")

      // Assert
      // 1. File is not in folder
      cy.contains(FILENAME_WORKSPACE_TO_FOLDER).should("not.exist", {
        timeout: CUSTOM_TIMEOUT,
      })
      // 2. File is in folder
      cy.visit(
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folders/${PARSED_TEST_REPO_FOLDER_NAME}`
      )
      cy.contains(TITLE_WORKSPACE_TO_FOLDER).should("exist")
    })

    it("Should be able to move a page from folder to subfolder", () => {
      cy.contains(FILENAME_WORKSPACE_TO_SUBFOLDER).should("exist")
      cy.get(
        `button[id^="folderItem-dropdown-${FILENAME_WORKSPACE_TO_SUBFOLDER}"]`
      ).click()
      cy.get("div[id^=move-]").first().click()
      cy.contains(`Move Page`)

      // Assert
      cy.contains(`Workspace > ${FILENAME_WORKSPACE_TO_SUBFOLDER}`)

      // Navigate to Move folder
      cy.get("i[id^=moveModal-forwardButton-]").eq(1).click({ force: true })
      // Navigate to Move subfolder
      cy.get("i[id^=moveModal-forwardButton-]").click({ force: true })

      // Assert
      cy.contains(
        `Workspace > ${TEST_REPO_FOLDER_NAME} > ${TEST_REPO_SUBFOLDER_NAME} > ${FILENAME_WORKSPACE_TO_SUBFOLDER}`
      )

      cy.contains("button", "Move Here").click()
      cy.contains("Successfully moved file", {
        timeout: CUSTOM_TIMEOUT,
      }).should("exist")

      // Assert
      // 1. File is not in Workspace
      cy.contains(FILENAME_WORKSPACE_TO_SUBFOLDER).should("not.exist", {
        timeout: CUSTOM_TIMEOUT,
      })
      // 2. File is in subfolder
      cy.visit(
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folders/${PARSED_TEST_REPO_FOLDER_NAME}/subfolders/${PARSED_TEST_REPO_SUBFOLDER_NAME}`
      )
      cy.contains(TITLE_WORKSPACE_TO_SUBFOLDER).should("exist")
    })
  })

  describe("Move pages out of folder", () => {
    const TITLE_FOLDER_TO_WORKSPACE = "Move from folder to Workspace"
    const FILENAME_FOLDER_TO_WORKSPACE = titleToPageFileName(
      TITLE_FOLDER_TO_WORKSPACE
    )

    const TITLE_FOLDER_TO_SUBFOLDER = "Move from folder to subfolder"
    const FILENAME_FOLDER_TO_SUBFOLDER = titleToPageFileName(
      TITLE_FOLDER_TO_SUBFOLDER
    )

    beforeEach(() => {
      cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
      window.localStorage.setItem("userId", "test")
      cy.visit(
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folders/${PARSED_TEST_REPO_FOLDER_NAME}`
      )
    })

    it("Should be able to navigate from folder to Workspace to subfolder back to folder via MoveModal buttons", () => {
      cy.contains(FILENAME_FOLDER_TO_WORKSPACE).should("exist")
      cy.get(
        `button[id^="folderItem-dropdown-${FILENAME_FOLDER_TO_WORKSPACE}"]`
      ).click()
      cy.get("div[id^=move-]").first().click()
      cy.contains(`Move Page`)

      cy.contains(
        `Workspace > ${TEST_REPO_FOLDER_NAME} > ${FILENAME_FOLDER_TO_WORKSPACE}`
      ).should("exist")

      // Navigate to Workspace
      cy.get("#moveModal-backButton").click({ force: true })
      cy.contains(`Workspace > ${TEST_REPO_FOLDER_NAME}`).should("exist")

      // Navigate to Move folder
      cy.get("i[id^=moveModal-forwardButton-]").eq(1).click({ force: true })
      cy.contains(
        `Workspace > ${TEST_REPO_FOLDER_NAME} > ${FILENAME_FOLDER_TO_WORKSPACE}`
      ).should("exist")

      // Navigate to Move subfolder
      cy.get("i[id^=moveModal-forwardButton-]").click({ force: true })
      cy.contains(
        `Workspace > ${TEST_REPO_FOLDER_NAME} > ${TEST_REPO_SUBFOLDER_NAME} > ${FILENAME_FOLDER_TO_WORKSPACE}`
      ).should("exist")

      // Navigate to Move folder
      cy.get("#moveModal-backButton").click({ force: true })
      cy.contains(
        `Workspace > ${TEST_REPO_FOLDER_NAME} > ${FILENAME_FOLDER_TO_WORKSPACE}`
      ).should("exist")
    })

    it("Should be able to move page from folder to itself and show correct success message", () => {
      cy.contains(FILENAME_FOLDER_TO_WORKSPACE).should("exist")
      cy.get(
        `button[id^="folderItem-dropdown-${FILENAME_FOLDER_TO_WORKSPACE}"]`
      ).click()
      cy.get("div[id^=move-]").first().click()
      cy.contains(`Move Page`)

      cy.contains("button", "Move Here").click()
      cy.contains("File is already in this folder", {
        timeout: CUSTOM_TIMEOUT,
      }).should("exist")
    })

    it("Should be able to move a page from folder to Workspace", () => {
      cy.contains(FILENAME_FOLDER_TO_WORKSPACE).should("exist")
      cy.get(
        `button[id^="folderItem-dropdown-${FILENAME_FOLDER_TO_WORKSPACE}"]`
      ).click()
      cy.get("div[id^=move-]").first().click()
      cy.contains(`Move Page`)

      // Assert
      cy.contains(
        `Workspace > ${TEST_REPO_FOLDER_NAME} > ${FILENAME_FOLDER_TO_WORKSPACE}`
      )

      cy.get("#moveModal-backButton").click({ force: true })

      // Assert
      cy.contains(`Workspace > ${FILENAME_FOLDER_TO_WORKSPACE}`)

      cy.contains("button", "Move Here").click()
      cy.contains("Successfully moved file", {
        timeout: CUSTOM_TIMEOUT,
      }).should("exist")

      // Assert
      // 1. File is not in folder
      cy.contains(FILENAME_FOLDER_TO_WORKSPACE).should("not.exist", {
        timeout: CUSTOM_TIMEOUT,
      })
      // 2. File is in Workspace
      cy.visit(`${CMS_BASEURL}/sites/${TEST_REPO_NAME}/workspace`)
      cy.contains(TITLE_FOLDER_TO_WORKSPACE).should("exist")
    })

    it("Should be able to move a page from folder to subfolder", () => {
      cy.contains(FILENAME_FOLDER_TO_SUBFOLDER).should("exist")
      cy.get(
        `button[id^="folderItem-dropdown-${FILENAME_FOLDER_TO_SUBFOLDER}"]`
      ).click()
      cy.get("div[id^=move-]").first().click()
      cy.contains(`Move Page`)

      // Assert
      cy.contains(
        `Workspace > ${TEST_REPO_FOLDER_NAME} > ${FILENAME_FOLDER_TO_SUBFOLDER}`
      )

      cy.get("i[id^=moveModal-forwardButton-]").click({ force: true })

      // Assert
      cy.contains(
        `Workspace > ${TEST_REPO_FOLDER_NAME} > ${TEST_REPO_SUBFOLDER_NAME} > ${FILENAME_FOLDER_TO_SUBFOLDER}`
      )

      cy.contains("button", "Move Here").click()
      cy.contains("Successfully moved file", {
        timeout: CUSTOM_TIMEOUT,
      }).should("exist")

      // Assert
      // 1. File is not in folder
      cy.contains(FILENAME_FOLDER_TO_SUBFOLDER).should("not.exist", {
        timeout: CUSTOM_TIMEOUT,
      })
      // 2. File is in subfolder
      cy.visit(
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folders/${PARSED_TEST_REPO_FOLDER_NAME}/subfolders/${PARSED_TEST_REPO_SUBFOLDER_NAME}`
      )
      cy.contains(TITLE_FOLDER_TO_SUBFOLDER).should("exist")
    })
  })

  describe("Move pages out from subfolder", () => {
    const TITLE_SUBFOLDER_TO_WORKSPACE = "Move from subfolder to Workspace"
    const FILENAME_SUBFOLDER_TO_WORKSPACE = titleToPageFileName(
      TITLE_SUBFOLDER_TO_WORKSPACE
    )

    const TITLE_SUBFOLDER_TO_FOLDER = "Move from subfolder to folder"
    const FILENAME_SUBFOLDER_TO_FOLDER = titleToPageFileName(
      TITLE_SUBFOLDER_TO_FOLDER
    )

    beforeEach(() => {
      cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
      window.localStorage.setItem("userId", "test")
      cy.visit(
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folders/${PARSED_TEST_REPO_FOLDER_NAME}/subfolders/${PARSED_TEST_REPO_SUBFOLDER_NAME}`
      )
    })

    it("Should be able to navigate from subfolder to folder to Workspace back to subfolder via MoveModal buttons", () => {
      cy.contains(FILENAME_SUBFOLDER_TO_WORKSPACE).should("exist")
      cy.get(
        `button[id^="folderItem-dropdown-${FILENAME_SUBFOLDER_TO_WORKSPACE}"]`
      ).click()
      cy.get("div[id^=move-]").first().click()
      cy.contains(`Move Page`)

      cy.contains(
        `Workspace > ${TEST_REPO_FOLDER_NAME} > ${TEST_REPO_SUBFOLDER_NAME} > ${FILENAME_SUBFOLDER_TO_WORKSPACE}`
      ).should("exist")

      // Navigate to Move folder
      cy.get("#moveModal-backButton").click({ force: true })
      cy.contains(
        `Workspace > ${TEST_REPO_FOLDER_NAME} > ${FILENAME_SUBFOLDER_TO_WORKSPACE}`
      ).should("exist")

      // Navigate to Workspace
      cy.get("#moveModal-backButton").click({ force: true })
      cy.contains(`Workspace > ${TEST_REPO_FOLDER_NAME}`).should("exist")

      // Navigate to Move folder
      cy.get("i[id^=moveModal-forwardButton-]").eq(1).click({ force: true })
      cy.contains(
        `Workspace > ${TEST_REPO_FOLDER_NAME} > ${FILENAME_SUBFOLDER_TO_WORKSPACE}`
      ).should("exist")

      // Navigate to Move subfolder
      cy.get("i[id^=moveModal-forwardButton-]").click({ force: true })
      cy.contains(
        `Workspace > ${TEST_REPO_FOLDER_NAME} > ${TEST_REPO_SUBFOLDER_NAME} > ${FILENAME_SUBFOLDER_TO_WORKSPACE}`
      ).should("exist")
    })

    it("Should be able to move page from subfolder to itself and show correct success message", () => {
      cy.contains(FILENAME_SUBFOLDER_TO_WORKSPACE).should("exist")
      cy.get(
        `button[id^="folderItem-dropdown-${FILENAME_SUBFOLDER_TO_WORKSPACE}"]`
      ).click()
      cy.get("div[id^=move-]").first().click()
      cy.contains(`Move Page`)

      cy.contains("button", "Move Here").click()
      cy.contains("File is already in this folder", {
        timeout: CUSTOM_TIMEOUT,
      }).should("exist")
    })

    it("Should be able to move a page from subfolder to Workspace", () => {
      cy.contains(FILENAME_SUBFOLDER_TO_WORKSPACE).should("exist")
      cy.get(
        `button[id^="folderItem-dropdown-${FILENAME_SUBFOLDER_TO_WORKSPACE}"]`
      ).click()
      cy.get("div[id^=move-]").first().click()
      cy.contains(`Move Page`)

      // Assert
      cy.contains(
        `Workspace > ${TEST_REPO_FOLDER_NAME} > ${TEST_REPO_SUBFOLDER_NAME} > ${FILENAME_SUBFOLDER_TO_WORKSPACE}`
      )

      cy.get("#moveModal-backButton").click({ force: true })
      // Assert
      cy.contains(
        `Workspace > ${TEST_REPO_FOLDER_NAME} > ${FILENAME_SUBFOLDER_TO_WORKSPACE}`
      )

      cy.get("#moveModal-backButton").click({ force: true })
      // Assert
      cy.contains(`Workspace > ${FILENAME_SUBFOLDER_TO_WORKSPACE}`)

      cy.contains("button", "Move Here").click()
      cy.contains("Successfully moved file", {
        timeout: CUSTOM_TIMEOUT,
      }).should("exist")

      // Assert
      // 1. File is not in subfolder
      cy.contains(FILENAME_SUBFOLDER_TO_WORKSPACE).should("not.exist", {
        timeout: CUSTOM_TIMEOUT,
      })
      // 2. File is in Workspace
      cy.visit(`${CMS_BASEURL}/sites/${TEST_REPO_NAME}/workspace`)
      cy.contains(TITLE_SUBFOLDER_TO_WORKSPACE).should("exist")
    })

    it("Should be able to move a page from subfolder to folder", () => {
      cy.contains(FILENAME_SUBFOLDER_TO_FOLDER).should("exist")
      cy.get(
        `button[id^="folderItem-dropdown-${FILENAME_SUBFOLDER_TO_FOLDER}"]`
      ).click()
      cy.get("div[id^=move-]").first().click()
      cy.contains(`Move Page`)

      // Assert
      cy.contains(
        `Workspace > ${TEST_REPO_FOLDER_NAME} > ${TEST_REPO_SUBFOLDER_NAME} > ${FILENAME_SUBFOLDER_TO_FOLDER}`
      )

      cy.get("#moveModal-backButton").click({ force: true })
      // Assert
      cy.contains(
        `Workspace > ${TEST_REPO_FOLDER_NAME} > ${FILENAME_SUBFOLDER_TO_FOLDER}`
      )

      cy.contains("button", "Move Here").click()
      cy.contains("Successfully moved file", {
        timeout: CUSTOM_TIMEOUT,
      }).should("exist")

      // Assert
      // 1. File is not in subfolder
      cy.contains(FILENAME_SUBFOLDER_TO_FOLDER).should("not.exist", {
        timeout: CUSTOM_TIMEOUT,
      })
      // 2. File is in Workspace
      cy.visit(
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folders/${PARSED_TEST_REPO_FOLDER_NAME}`
      )
      cy.contains(TITLE_SUBFOLDER_TO_FOLDER).should("exist")
    })
  })
})
