import { slugifyCategory } from "utils/fileNameUtils"

import {
  CMS_BASEURL,
  Interceptors,
  TEST_REPO_NAME,
} from "../fixtures/constants"

describe("Move flow", () => {
  const TEST_REPO_FOLDER_NAME = "Move Folder"
  const PARSED_TEST_REPO_FOLDER_NAME = slugifyCategory(TEST_REPO_FOLDER_NAME)

  const TEST_REPO_SUBFOLDER_NAME = "Move subfolder"
  const PARSED_TEST_REPO_SUBFOLDER_NAME = encodeURIComponent(
    TEST_REPO_SUBFOLDER_NAME
  )

  const TEST_REPO_RESOURCE_ROOM_NAME = "Resources"
  const PARSED_TEST_REPO_RESOURCE_ROOM_NAME = slugifyCategory(
    TEST_REPO_RESOURCE_ROOM_NAME
  )
  const TEST_REPO_RESOURCE_CATEGORY_NAME = "Move Resource Category"
  const PARSED_TEST_REPO_RESOURCE_CATEGORY_NAME = slugifyCategory(
    TEST_REPO_RESOURCE_CATEGORY_NAME
  )
  const TEST_REPO_RESOURCE_CATEGORY_NAME_1 = "Move Resource Category 1"
  const PARSED_TEST_REPO_RESOURCE_CATEGORY_NAME_1 = slugifyCategory(
    TEST_REPO_RESOURCE_CATEGORY_NAME_1
  )

  beforeEach(() => {
    cy.setupDefaultInterceptors()
    cy.setGithubSessionDefaults()
  })

  describe("Move pages out of Workspace", () => {
    const TITLE_WORKSPACE_TO_FOLDER = "Move from Workspace to folder"
    const TITLE_WORKSPACE_TO_SUBFOLDER = "Move from Workspace to subfolder"

    beforeEach(() => {
      cy.visit(`${CMS_BASEURL}/sites/${TEST_REPO_NAME}/workspace`)
      cy.contains("Verify").should("not.exist")
    })

    it("Should be able to navigate from Workspace to subfolder back to Workspace via MoveModal buttons", () => {
      cy.contains("button", TITLE_WORKSPACE_TO_FOLDER)
        .parent()
        .parent()
        .as("pageItem")
        .should("exist")
      cy.clickContextMenuItem("@pageItem", "Move to")

      cy.contains(`Move Here`)

      cy.get("u").first().getFirstSiblingAs("currentLocationBreadcrumb")
      cy.verifyBreadcrumb("@currentLocationBreadcrumb", [
        "Workspace",
        TITLE_WORKSPACE_TO_FOLDER,
      ])
      cy.get("u").last().getFirstSiblingAs("movedLocationBreadcrumb")
      cy.verifyBreadcrumb("@movedLocationBreadcrumb", [
        "Workspace",
        TITLE_WORKSPACE_TO_FOLDER,
      ])

      // Navigate to Move folder
      cy.get("button[id^=moveModal-forwardButton-]")
        .eq(1)
        .click({ force: true })

      cy.get("u").first().getFirstSiblingAs("moveFolderCurrentBreadcrumb")
      cy.verifyBreadcrumb("@moveFolderCurrentBreadcrumb", [
        "Workspace",
        TITLE_WORKSPACE_TO_FOLDER,
      ])
      cy.get("u").last().getFirstSiblingAs("moveFolderUpdatedBreadcrumb")
      cy.verifyBreadcrumb("@moveFolderUpdatedBreadcrumb", [
        "Workspace",
        TEST_REPO_FOLDER_NAME,
        TITLE_WORKSPACE_TO_FOLDER,
      ])

      // Navigate to Move subfolder
      cy.get("button[id^=moveModal-forwardButton-]").click({ force: true })

      cy.get("u").first().getFirstSiblingAs("subFolderCurrentBreadcrumb")
      cy.verifyBreadcrumb("@subFolderCurrentBreadcrumb", [
        "Workspace",
        TITLE_WORKSPACE_TO_FOLDER,
      ])
      cy.get("u").last().getFirstSiblingAs("subFolderUpdatedBreadcrumb")
      cy.verifyBreadcrumb("@subFolderUpdatedBreadcrumb", [
        "Workspace",
        TEST_REPO_FOLDER_NAME,
        TEST_REPO_SUBFOLDER_NAME,
        TITLE_WORKSPACE_TO_FOLDER,
      ])

      // Navigate to Move folder
      cy.get("#moveModal-backButton").click({ force: true })

      cy.get("u").first().getFirstSiblingAs("moveFolderCurrentBreadcrumb")
      cy.verifyBreadcrumb("@moveFolderCurrentBreadcrumb", [
        "Workspace",
        TITLE_WORKSPACE_TO_FOLDER,
      ])
      cy.get("u").last().getFirstSiblingAs("moveFolderUpdatedBreadcrumb")
      cy.verifyBreadcrumb("@moveFolderUpdatedBreadcrumb", [
        "Workspace",
        TEST_REPO_FOLDER_NAME,
        TITLE_WORKSPACE_TO_FOLDER,
      ])

      // Navigate to Workspace
      cy.get("#moveModal-backButton").click({ force: true })

      cy.get("u").first().getFirstSiblingAs("workspaceCurrentBreadcrumb")
      cy.verifyBreadcrumb("@workspaceCurrentBreadcrumb", [
        "Workspace",
        TITLE_WORKSPACE_TO_FOLDER,
      ])
      cy.get("u").last().getFirstSiblingAs("workspaceUpdatedBreadcrumb")
      cy.verifyBreadcrumb("@workspaceUpdatedBreadcrumb", [
        "Workspace",
        TITLE_WORKSPACE_TO_FOLDER,
      ])
    })

    it("Should be able to move page from Workspace to itself and show correct success message", () => {
      cy.contains("button", TITLE_WORKSPACE_TO_FOLDER)
        .parent()
        .parent()
        .as("pageItem")
        .should("exist")
      cy.clickContextMenuItem("@pageItem", "Move to")

      cy.contains(`Move Here`)

      cy.contains("button", "Move Here").click()

      cy.contains("File is already in this folder").should("exist")
    })

    it("Should be able to move a page from Workspace to folder", () => {
      cy.contains("button", TITLE_WORKSPACE_TO_FOLDER)
        .parent()
        .parent()
        .as("pageItem")
        .should("exist")
      cy.clickContextMenuItem("@pageItem", "Move to")

      cy.contains(`Move Here`)

      // Assert
      cy.get("u").last().getFirstSiblingAs("currentBreadcrumb")
      cy.verifyBreadcrumb("@currentBreadcrumb", [
        "Workspace",
        TITLE_WORKSPACE_TO_FOLDER,
      ])

      // Navigate to Move folder
      cy.get("button[id^=moveModal-forwardButton-]")
        .eq(1)
        .click({ force: true })

      // Assert
      cy.get("u").first().getFirstSiblingAs("moveFolderCurrentBreadcrumb")
      cy.verifyBreadcrumb("@moveFolderCurrentBreadcrumb", [
        "Workspace",
        TITLE_WORKSPACE_TO_FOLDER,
      ])
      cy.get("u").last().getFirstSiblingAs("moveFolderUpdatedBreadcrumb")
      cy.verifyBreadcrumb("@moveFolderUpdatedBreadcrumb", [
        "Workspace",
        TEST_REPO_FOLDER_NAME,
        TITLE_WORKSPACE_TO_FOLDER,
      ])

      cy.contains("button", "Move Here").click().wait(Interceptors.POST)

      cy.contains("Successfully moved file").should("exist")

      // Assert
      // 1. File is not in folder
      cy.contains(TITLE_WORKSPACE_TO_FOLDER).should("not.exist")
      // 2. File is in folder
      cy.visit(
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folders/${PARSED_TEST_REPO_FOLDER_NAME}`
      )

      cy.contains(TITLE_WORKSPACE_TO_FOLDER).should("exist")
    })

    it("Should be able to move a page from folder to subfolder", () => {
      cy.contains("button", TITLE_WORKSPACE_TO_SUBFOLDER)
        .parent()
        .parent()
        .as("pageItem")
        .should("exist")
      cy.clickContextMenuItem("@pageItem", "Move to")

      cy.contains(`Move Here`)

      // Assert
      cy.get("u").first().getFirstSiblingAs("currentBreadcrumb")
      cy.verifyBreadcrumb("@currentBreadcrumb", [
        "Workspace",
        TITLE_WORKSPACE_TO_SUBFOLDER,
      ])
      cy.get("u").last().getFirstSiblingAs("updatedBreadcrumb")
      cy.verifyBreadcrumb("@updatedBreadcrumb", [
        "Workspace",
        TITLE_WORKSPACE_TO_SUBFOLDER,
      ])

      // Navigate to Move folder
      cy.get("button[id^=moveModal-forwardButton-]")
        .eq(1)
        .click({ force: true })

      // Navigate to Move subfolder
      cy.get("button[id^=moveModal-forwardButton-]").click({
        force: true,
      })

      // Assert
      cy.get("u").first().getFirstSiblingAs("subfolderCurrentBreadcrumb")
      cy.verifyBreadcrumb("@subfolderCurrentBreadcrumb", [
        "Workspace",
        TITLE_WORKSPACE_TO_SUBFOLDER,
      ])
      cy.get("u").last().getFirstSiblingAs("subfolderUpdatedBreadcrumb")
      cy.verifyBreadcrumb("@subfolderUpdatedBreadcrumb", [
        "Workspace",
        TEST_REPO_FOLDER_NAME,
        TEST_REPO_SUBFOLDER_NAME,
        TITLE_WORKSPACE_TO_SUBFOLDER,
      ])

      cy.contains("button", "Move Here").click().wait(Interceptors.POST)

      cy.contains("Successfully moved file").should("exist")

      // Assert
      // 1. File is not in Workspace
      cy.contains(TITLE_WORKSPACE_TO_SUBFOLDER).should("not.exist")
      // 2. File is in subfolder
      cy.visit(
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folders/${PARSED_TEST_REPO_FOLDER_NAME}/subfolders/${PARSED_TEST_REPO_SUBFOLDER_NAME}`
      )

      cy.contains(TITLE_WORKSPACE_TO_SUBFOLDER).should("exist")
    })
  })

  describe("Move pages out of folder", () => {
    const TITLE_FOLDER_TO_WORKSPACE = "Move from folder to Workspace"
    const TITLE_FOLDER_TO_SUBFOLDER = "Move from folder to subfolder"

    beforeEach(() => {
      cy.visit(
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folders/${PARSED_TEST_REPO_FOLDER_NAME}`
      )
      cy.contains("Verify").should("not.exist")
    })

    it("Should be able to navigate from folder to Workspace to subfolder back to folder via MoveModal buttons", () => {
      cy.contains("button", TITLE_FOLDER_TO_WORKSPACE)
        .parent()
        .parent()
        .as("folderItem")
        .should("exist")
      cy.clickContextMenuItem("@folderItem", "Move to")
      cy.contains(`Move Here`)

      cy.get("u").eq(1).getFirstSiblingAs("currentLocationBreadcrumb")
      cy.verifyBreadcrumb("@currentLocationBreadcrumb", [
        "Workspace",
        TEST_REPO_FOLDER_NAME,
        TITLE_FOLDER_TO_WORKSPACE,
      ])

      cy.get("u").last().getFirstSiblingAs("movedLocationBreadcrumb")
      cy.verifyBreadcrumb("@movedLocationBreadcrumb", [
        "Workspace",
        TEST_REPO_FOLDER_NAME,
        TITLE_FOLDER_TO_WORKSPACE,
      ])

      // Navigate to Workspace
      cy.get("#moveModal-backButton").click({ force: true })

      cy.get("u").first().getFirstSiblingAs("workspaceBreadcrumb")
      cy.verifyBreadcrumb("@workspaceBreadcrumb", [
        "Workspace",
        TEST_REPO_FOLDER_NAME,
        TITLE_FOLDER_TO_WORKSPACE,
      ])
      cy.get("u").last().getFirstSiblingAs("folderBreadcrumb")
      cy.verifyBreadcrumb("@folderBreadcrumb", [
        "Workspace",
        TITLE_FOLDER_TO_WORKSPACE,
      ])

      // Navigate to Move folder
      cy.get("button[id^=moveModal-forwardButton-]")
        .eq(1)
        .click({ force: true })

      cy.get("u").eq(1).getFirstSiblingAs("moveFolderBreadcrumb")
      cy.verifyBreadcrumb("@moveFolderBreadcrumb", [
        "Workspace",
        TEST_REPO_FOLDER_NAME,
        TITLE_FOLDER_TO_WORKSPACE,
      ])
      cy.get("u").last().parent().getFirstSiblingAs("movedLocationBreadcrumb")
      cy.verifyBreadcrumb("@movedLocationBreadcrumb", [
        "Workspace",
        TEST_REPO_FOLDER_NAME,
        TITLE_FOLDER_TO_WORKSPACE,
      ])

      // Navigate to Move subfolder
      cy.get("button[id^=moveModal-forwardButton-]").click({ force: true })

      cy.get("u").last().getFirstSiblingAs("subFolderBreadcrumb")
      cy.verifyBreadcrumb("@subFolderBreadcrumb", [
        "Workspace",
        TEST_REPO_FOLDER_NAME,
        TEST_REPO_SUBFOLDER_NAME,
        TITLE_FOLDER_TO_WORKSPACE,
      ])

      // Navigate to Move folder
      cy.get("#moveModal-backButton").click({ force: true })

      cy.get("u").last().parent().getFirstSiblingAs("moveBreadcrumb")
      cy.verifyBreadcrumb("@moveBreadcrumb", [
        "Workspace",
        TEST_REPO_FOLDER_NAME,
        TITLE_FOLDER_TO_WORKSPACE,
      ])
    })

    it("Should be able to move page from folder to itself and show correct success message", () => {
      cy.contains("button", TITLE_FOLDER_TO_WORKSPACE)
        .parent()
        .parent()
        .as("folderItem")
        .should("exist")
      cy.clickContextMenuItem("@folderItem", "Move to")
      cy.contains("button", "Move Here").click()

      cy.contains("File is already in this folder").should("exist")
    })

    it("Should be able to move a page from folder to Workspace", () => {
      cy.contains("button", TITLE_FOLDER_TO_WORKSPACE)
        .parent()
        .parent()
        .as("folderItem")
        .should("exist")
      cy.clickContextMenuItem("@folderItem", "Move to")
      cy.contains("button", "Move Here").should("exist")

      // Assert
      cy.get("u").last().getFirstSiblingAs("initialLocationBreadcrumb")
      cy.verifyBreadcrumb("@initialLocationBreadcrumb", [
        "Workspace",
        TEST_REPO_FOLDER_NAME,
        TITLE_FOLDER_TO_WORKSPACE,
      ])

      cy.get("#moveModal-backButton").click({ force: true })

      // Assert
      cy.get("u").last().getFirstSiblingAs("movedLocationBreadcrumb")
      cy.verifyBreadcrumb("@movedLocationBreadcrumb", [
        "Workspace",
        TITLE_FOLDER_TO_WORKSPACE,
      ])

      cy.contains("button", "Move Here").click().wait(Interceptors.POST)

      cy.contains("Successfully moved file").should("exist")

      // Assert
      // 1. File is not in folder
      cy.contains(TITLE_FOLDER_TO_WORKSPACE).should("not.exist")
      // 2. File is in Workspace
      cy.visit(`${CMS_BASEURL}/sites/${TEST_REPO_NAME}/workspace`)

      cy.contains(TITLE_FOLDER_TO_WORKSPACE).should("exist")
    })

    it("Should be able to move a page from folder to subfolder", () => {
      cy.contains("button", TITLE_FOLDER_TO_SUBFOLDER)
        .parent()
        .parent()
        .as("folderItem")
        .should("exist")
      cy.clickContextMenuItem("@folderItem", "Move to")
      cy.contains("Move Here").should("exist")

      // Assert
      cy.get("u").last().getFirstSiblingAs("currentLocationBreadcrumb")
      cy.verifyBreadcrumb("@currentLocationBreadcrumb", [
        "Workspace",
        TEST_REPO_FOLDER_NAME,
        TITLE_FOLDER_TO_SUBFOLDER,
      ])

      cy.get("button[id^=moveModal-forwardButton-]").click({
        force: true,
      })

      // Assert
      cy.get("u").last().getFirstSiblingAs("movedLocationBreadcrumb")
      cy.verifyBreadcrumb("@movedLocationBreadcrumb", [
        "Workspace",
        TEST_REPO_FOLDER_NAME,
        TEST_REPO_SUBFOLDER_NAME,
        TITLE_FOLDER_TO_SUBFOLDER,
      ])

      cy.contains("button", "Move Here").click().wait(Interceptors.POST)

      cy.contains("Successfully moved file").should("exist")

      // Assert
      // 1. File is not in folder
      cy.contains(TITLE_FOLDER_TO_SUBFOLDER).should("not.exist")
      // 2. File is in subfolder
      cy.visit(
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folders/${PARSED_TEST_REPO_FOLDER_NAME}/subfolders/${PARSED_TEST_REPO_SUBFOLDER_NAME}`
      )

      cy.contains(TITLE_FOLDER_TO_SUBFOLDER).should("exist")
    })
  })

  describe("Move pages out from subfolder", () => {
    const TITLE_SUBFOLDER_TO_WORKSPACE = "Move from subfolder to Workspace"
    const TITLE_SUBFOLDER_TO_FOLDER = "Move from subfolder to folder"

    beforeEach(() => {
      cy.visit(
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folders/${PARSED_TEST_REPO_FOLDER_NAME}/subfolders/${PARSED_TEST_REPO_SUBFOLDER_NAME}`
      )
      cy.contains("Verify").should("not.exist")
    })

    it("Should be able to navigate from subfolder to folder to Workspace back to subfolder via MoveModal buttons", () => {
      cy.contains("button", TITLE_SUBFOLDER_TO_WORKSPACE)
        .parent()
        .parent()
        .as("folderItem")
        .should("exist")
      cy.clickContextMenuItem("@folderItem", "Move to")
      cy.contains(`Move Here`)

      cy.get("u").last().getFirstSiblingAs("currentBreadcrumb")
      cy.verifyBreadcrumb("@currentBreadcrumb", [
        "Workspace",
        TEST_REPO_FOLDER_NAME,
        TEST_REPO_SUBFOLDER_NAME,
        TITLE_SUBFOLDER_TO_WORKSPACE,
      ])

      // Navigate to Move folder
      cy.get("#moveModal-backButton").click({ force: true })

      cy.get("u").last().getFirstSiblingAs("moveFolderUpdatedBreadcrumb")
      cy.verifyBreadcrumb("@moveFolderUpdatedBreadcrumb", [
        "Workspace",
        TEST_REPO_FOLDER_NAME,
        TITLE_SUBFOLDER_TO_WORKSPACE,
      ])

      // Navigate to Workspace
      cy.get("#moveModal-backButton").click({ force: true })

      cy.get("u").last().getFirstSiblingAs("workspaceUpdatedBreadcrumb")
      cy.verifyBreadcrumb("@workspaceUpdatedBreadcrumb", [
        "Workspace",
        TITLE_SUBFOLDER_TO_WORKSPACE,
      ])

      // Navigate to Move folder
      cy.get("button[id^=moveModal-forwardButton-]")
        .eq(1)
        .click({ force: true })

      cy.get("u").last().getFirstSiblingAs("moveFolderUpdatedBreadcrumb")
      cy.verifyBreadcrumb("@moveFolderUpdatedBreadcrumb", [
        "Workspace",
        TEST_REPO_FOLDER_NAME,
        TITLE_SUBFOLDER_TO_WORKSPACE,
      ])

      // Navigate to Move subfolder
      cy.get("button[id^=moveModal-forwardButton-]").click({ force: true })

      cy.get("u").last().getFirstSiblingAs("moveSubfolderUpdatedBreadcrumb")
      cy.verifyBreadcrumb("@moveSubfolderUpdatedBreadcrumb", [
        "Workspace",
        TEST_REPO_FOLDER_NAME,
        TEST_REPO_SUBFOLDER_NAME,
        TITLE_SUBFOLDER_TO_WORKSPACE,
      ])
    })

    it("Should be able to move page from subfolder to itself and show correct success message", () => {
      cy.contains("button", TITLE_SUBFOLDER_TO_WORKSPACE)
        .parent()
        .parent()
        .as("folderItem")
        .should("exist")
      cy.clickContextMenuItem("@folderItem", "Move to")

      cy.contains("button", "Move Here").click()

      cy.contains("File is already in this folder").should("exist")
    })

    it("Should be able to move a page from subfolder to Workspace", () => {
      cy.contains("button", TITLE_SUBFOLDER_TO_WORKSPACE)
        .parent()
        .parent()
        .as("folderItem")
        .should("exist")
      cy.clickContextMenuItem("@folderItem", "Move to")
      cy.contains("button", "Move Here")

      cy.get("u").last().getFirstSiblingAs("currentBreadcrumb")
      cy.verifyBreadcrumb("@currentBreadcrumb", [
        "Workspace",
        TEST_REPO_FOLDER_NAME,
        TEST_REPO_SUBFOLDER_NAME,
        TITLE_SUBFOLDER_TO_WORKSPACE,
      ])

      // Assert
      cy.get("u").last().getFirstSiblingAs("currentBreadcrumb")
      cy.verifyBreadcrumb("@currentBreadcrumb", [
        "Workspace",
        TEST_REPO_FOLDER_NAME,
        TEST_REPO_SUBFOLDER_NAME,
        TITLE_SUBFOLDER_TO_WORKSPACE,
      ])

      cy.get("#moveModal-backButton").click({ force: true })

      // Assert
      cy.get("u").last().getFirstSiblingAs("folderBreadcrumb")
      cy.verifyBreadcrumb("@folderBreadcrumb", [
        "Workspace",
        TEST_REPO_FOLDER_NAME,
        TITLE_SUBFOLDER_TO_WORKSPACE,
      ])

      cy.get("#moveModal-backButton").click({ force: true })

      // Assert
      cy.get("u").last().getFirstSiblingAs("workspaceBreadcrumb")
      cy.verifyBreadcrumb("@workspaceBreadcrumb", [
        "Workspace",
        TITLE_SUBFOLDER_TO_WORKSPACE,
      ])

      cy.contains("button", "Move Here").click().wait(Interceptors.POST)

      cy.contains("Successfully moved file").should("exist")

      // Assert
      // 1. File is not in subfolder
      cy.contains(TITLE_SUBFOLDER_TO_WORKSPACE).should("not.exist")
      // 2. File is in Workspace
      cy.visit(`${CMS_BASEURL}/sites/${TEST_REPO_NAME}/workspace`)

      cy.contains(TITLE_SUBFOLDER_TO_WORKSPACE).should("exist")
    })

    it("Should be able to move a page from subfolder to folder", () => {
      cy.contains("button", TITLE_SUBFOLDER_TO_FOLDER)
        .parent()
        .parent()
        .as("folderItem")
        .should("exist")
      cy.clickContextMenuItem("@folderItem", "Move to")
      cy.contains("button", "Move Here")

      // Assert
      cy.get("u").last().getFirstSiblingAs("currentBreadcrumb")
      cy.verifyBreadcrumb("@currentBreadcrumb", [
        "Workspace",
        TEST_REPO_FOLDER_NAME,
        TEST_REPO_SUBFOLDER_NAME,
        TITLE_SUBFOLDER_TO_FOLDER,
      ])

      cy.get("#moveModal-backButton").click({ force: true })

      // Assert
      cy.get("u").last().getFirstSiblingAs("updatedBreadcrumb")
      cy.verifyBreadcrumb("@updatedBreadcrumb", [
        "Workspace",
        TEST_REPO_FOLDER_NAME,
        TITLE_SUBFOLDER_TO_FOLDER,
      ])

      cy.contains("button", "Move Here").click().wait(Interceptors.POST)

      cy.contains("Successfully moved file").should("exist")

      // Assert
      // 1. File is not in subfolder
      cy.contains(TITLE_SUBFOLDER_TO_FOLDER).should("not.exist")
      // 2. File is in Workspace
      cy.visit(
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/folders/${PARSED_TEST_REPO_FOLDER_NAME}`
      )

      cy.contains(TITLE_SUBFOLDER_TO_FOLDER).should("exist")
    })
  })

  describe("Move pages between resource folders", () => {
    const TITLE_RESOURCE_PAGE = "Move resource page"

    beforeEach(() => {
      cy.visit(
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/resourceRoom/${PARSED_TEST_REPO_RESOURCE_ROOM_NAME}/resourceCategory/${PARSED_TEST_REPO_RESOURCE_CATEGORY_NAME}`
      )
      cy.contains("Verify").should("not.exist")
    })

    it("Should be able to navigate from Resource Category to Resource Room back to Resource Category via MoveModal buttons", () => {
      cy.contains("button", TITLE_RESOURCE_PAGE)
        .parent()
        .parent()
        .parent()
        .as("resourcePage")
        .should("exist")
      cy.clickContextMenuItem("@resourcePage", "Move to")
      cy.contains("button", "Move Here")

      // Assert
      cy.get("u").last().getFirstSiblingAs("currentBreadcrumb")
      cy.verifyBreadcrumb("@currentBreadcrumb", [
        "Workspace",
        TEST_REPO_RESOURCE_ROOM_NAME,
        TEST_REPO_RESOURCE_CATEGORY_NAME,
        TITLE_RESOURCE_PAGE,
      ])

      // Navigate to Resource Room
      cy.get("#moveModal-backButton").click({ force: true })

      cy.get("u").last().getFirstSiblingAs("updatedBreadcrumb")
      cy.verifyBreadcrumb("@updatedBreadcrumb", [
        "Workspace",
        TEST_REPO_RESOURCE_ROOM_NAME,
        TITLE_RESOURCE_PAGE,
      ])

      // Navigate to Resource Category
      cy.get("button[id^=moveModal-forwardButton-]")
        .eq(1)
        .click({ force: true })

      cy.get("u").last().getFirstSiblingAs("resourceCategoryBreadcrumb")
      cy.verifyBreadcrumb("@resourceCategoryBreadcrumb", [
        "Workspace",
        TEST_REPO_RESOURCE_ROOM_NAME,
        TEST_REPO_RESOURCE_CATEGORY_NAME,
        TITLE_RESOURCE_PAGE,
      ])
    })

    it("Should be able to move page from resource category to itself and show correct success message", () => {
      cy.contains("button", TITLE_RESOURCE_PAGE)
        .parent()
        .parent()
        .parent()
        .as("resourcePage")
        .should("exist")
      cy.clickContextMenuItem("@resourcePage", "Move to")
      cy.contains("button", "Move Here").click()

      cy.contains("File is already in this folder").should("exist")
    })

    it("Should be able to move page from resource category to another resource category", () => {
      cy.contains("button", TITLE_RESOURCE_PAGE)
        .parent()
        .parent()
        .parent()
        .as("resourcePage")
        .should("exist")
      cy.clickContextMenuItem("@resourcePage", "Move to")
      cy.contains("button", "Move Here")

      // Assert
      cy.get("u").last().getFirstSiblingAs("currentBreadcrumb")
      cy.verifyBreadcrumb("@currentBreadcrumb", [
        "Workspace",
        TEST_REPO_RESOURCE_ROOM_NAME,
        TEST_REPO_RESOURCE_CATEGORY_NAME,
        TITLE_RESOURCE_PAGE,
      ])

      // Navigate to Resource Room
      cy.get("#moveModal-backButton").click({ force: true })

      cy.get("u").last().getFirstSiblingAs("resourceRoomBreadcrumb")
      cy.verifyBreadcrumb("@resourceRoomBreadcrumb", [
        "Workspace",
        TEST_REPO_RESOURCE_ROOM_NAME,
        TITLE_RESOURCE_PAGE,
      ])

      // Navigate to Resource Category
      cy.get("button[id^=moveModal-forwardButton-]")
        .eq(0)
        .click({ force: true })

      cy.get("u").last().getFirstSiblingAs("resourceCategoryBreadcrumb")
      cy.verifyBreadcrumb("@resourceCategoryBreadcrumb", [
        "Workspace",
        TEST_REPO_RESOURCE_ROOM_NAME,
        TEST_REPO_RESOURCE_CATEGORY_NAME_1,
        TITLE_RESOURCE_PAGE,
      ])

      cy.contains("button", "Move Here").click().wait(Interceptors.POST)

      cy.contains("Successfully moved file").should("exist")

      // Assert
      // 1. File is not in resource category
      cy.contains(TITLE_RESOURCE_PAGE).should("not.exist")
      // 2. File is in resource category 1
      cy.visit(
        `${CMS_BASEURL}/sites/${TEST_REPO_NAME}/resourceRoom/${PARSED_TEST_REPO_RESOURCE_ROOM_NAME}/resourceCategory/${PARSED_TEST_REPO_RESOURCE_CATEGORY_NAME_1}`
      )

      cy.contains(TITLE_RESOURCE_PAGE).should("exist")
    })
  })
})
