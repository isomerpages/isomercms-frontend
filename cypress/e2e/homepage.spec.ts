import { keyCodes, TEST_REPO_NAME, timings } from "../fixtures/constants"
import { getHandleSelector } from "../utils/dnd"

const visitHomepage = () => {
  cy.visit(`/sites/${TEST_REPO_NAME}/homepage`)
}

const NOTIFICATION_BAR_PREVIEW_SELECTOR = "div[id='notification-bar']"
const NOTIFICATION_INPUT_SELECTOR = 'input[id="site-notification"]'

const HERO_BUTTON_INPUT_SELECTOR = 'input[id*="hero-button"]'
const HERO_BUTTON_PREVIEW_SELECTOR = 'div[class*="search-button"]'

const HERO_SECTION_HIGHLIGHTS_SELECTOR = 'input[id="radio-highlights"]'
const HERO_SECTION_DROPDOWN_SELECTOR = 'input[id="radio-dropdown"]'

const ADD_SECTION_DROPDOWN_SELECTOR = 'select[id="section-new"]'

const getAddSectionButtonSelector = (): "@addSectionButton" => {
  cy.contains("div", "Add a new section").find("button").as("addSectionButton")

  return "@addSectionButton"
}

const getPreviewSectionSelectorByTitle = (title: string): `@${string}` => {
  cy.contains("section", title).as(`section-${title}`).should("exist")
  return `@section-${title}`
}

const SECTION_DROPDOWN_OPTIONS = {
  DEFAULT: "--Choose a new section--",
  RESOURCES: "Resources",
  INFOBAR: "Infobar",
  INFOPIC: "Infopic",
}

const toggleSectionDropdown = (section: string) => {
  cy.contains(section).next().click()
}

describe("Homepage", () => {
  beforeEach(() => {
    cy.setupDefaultInterceptors()
    cy.setGithubSessionDefaults()
    visitHomepage()
  })

  describe("Block editing", () => {
    it("should display the site notification correctly", () => {
      // Arrange
      const MOCK_NOTIFICATION_TEXT = "This is a mock notification"
      const notificationPreviewAlias = "notificationPreview"
      cy.get(NOTIFICATION_BAR_PREVIEW_SELECTOR).as(notificationPreviewAlias)
      // NOTE: Clear the input first to prevent any existing text
      // from interfering with the test
      cy.get(NOTIFICATION_INPUT_SELECTOR).as("notificationInput").clear().blur()
      cy.get(`@${notificationPreviewAlias}`).should("not.exist")

      // Act
      cy.get("@notificationInput").type(MOCK_NOTIFICATION_TEXT).blur()

      // Assert

      cy.get(`@${notificationPreviewAlias}`)
        .should("exist")
        .contains(MOCK_NOTIFICATION_TEXT)
    })

    it("should only allow up to 4 highlights for the hero section", () => {
      // Arrange
      // NOTE: Toggle the dropdown
      toggleSectionDropdown("Hero section")
      cy.get(HERO_SECTION_HIGHLIGHTS_SELECTOR).check()
      cy.contains("button", "Add highlight").as("addHighlightButton")

      // Act
      // NOTE: We assume that there are 3 highlights at the start
      // as this is the initial state post-reset.
      // NOTE: We require this because it clicks on the center by default
      // which is where the text is.
      // As we search for grandparent element to trigger the state change,
      // clicking on the text will have the wrong grandparent element
      // leading to no state change.
      cy.get("@addHighlightButton").click("top")

      // Assert
      cy.get("@addHighlightButton").should("be.disabled")
    })

    it("should remove the button in preview when the hero button content is not given", () => {
      // Arrange
      const MOCK_HERO_BUTTON_TEXT = "This is a mock hero button text"
      toggleSectionDropdown("Hero section")
      cy.get(HERO_BUTTON_PREVIEW_SELECTOR)
        .as("heroButtonPreview")
        .should("exist")
      cy.get(HERO_BUTTON_INPUT_SELECTOR).clear().blur()
      cy.get("@heroButtonPreview").should("not.exist")

      // Act
      cy.get(HERO_BUTTON_INPUT_SELECTOR).type(MOCK_HERO_BUTTON_TEXT).blur()

      // Assert
      cy.get("@heroButtonPreview")
        .should("exist")
        .contains(MOCK_HERO_BUTTON_TEXT)
    })

    it("should preserve content when swapping between highlights and dropdown for hero section", () => {
      // Arrange
      const UPDATED_HERO_BUTTON_TEXT = "This is changed blah blah"
      toggleSectionDropdown("Hero section")

      // Act
      cy.get(HERO_SECTION_HIGHLIGHTS_SELECTOR).check()
      cy.get(HERO_BUTTON_INPUT_SELECTOR).clear().type(UPDATED_HERO_BUTTON_TEXT)
      cy.get(HERO_SECTION_DROPDOWN_SELECTOR).check()
      cy.get(HERO_SECTION_HIGHLIGHTS_SELECTOR).check()

      // Assert
      cy.get(HERO_BUTTON_INPUT_SELECTOR).should(
        "have.value",
        UPDATED_HERO_BUTTON_TEXT
      )
    })

    it("should limit users to a single resource component", () => {
      // Arrange
      // NOTE: Precondition here is that there are NO existing resources
      cy.get(ADD_SECTION_DROPDOWN_SELECTOR).select(
        SECTION_DROPDOWN_OPTIONS.DEFAULT
      )
      cy.contains("div", "Add a new section")
        .find("button")
        .as("addSectionButton")
        .should("be.disabled")

      // Act
      cy.get(ADD_SECTION_DROPDOWN_SELECTOR).select(
        SECTION_DROPDOWN_OPTIONS.RESOURCES
      )
      cy.get("@addSectionButton").click()

      // Assert
      // NOTE: This is an existing bug on `production`
      // where adding a resource section doesn't disable.
      cy.get("@addSectionButton").should("be.disabled")
    })

    it.skip("should snap preview to that section when clicking on the section in the editor", () => {
      // NOTE: Not testing this because cypress doesn't support viewports checking
    })

    it("should rearrange the blocks correctly and the preview should also reflect the new order", () => {
      // Arrange
      cy.get(ADD_SECTION_DROPDOWN_SELECTOR).select(
        SECTION_DROPDOWN_OPTIONS.INFOPIC
      )
      const addButtonSelector = getAddSectionButtonSelector()
      cy.get(addButtonSelector).click()

      // NOTE: Initial order is Infobar -> Infopic
      cy.get(getHandleSelector()).eq(0).as("first").should("contain", "Infobar")
      cy.get(getHandleSelector()).eq(1).should("contain", "Infopic")
      const infobarPreviewSelector = getPreviewSectionSelectorByTitle("Infobar")
      const infopicPreviewSelector = getPreviewSectionSelectorByTitle("Infopic")
      cy.get(infobarPreviewSelector)
        .parent()
        .next()
        .should("contain", "Infopic")

      // Act
      // reorder operation
      cy.get("@first")
        .focus()
        .trigger("keydown", { keyCode: keyCodes.space })
        // need to re-query for a clone
        .get("@first")
        .trigger("keydown", { keyCode: keyCodes.arrowDown, force: true })
        // finishing before the movement time is fine - but this looks nice
        .wait(timings.outOfTheWay * 1000)
        .trigger("keydown", { keyCode: keyCodes.space, force: true })

      // Assert
      // NOTE: Order is now Infopic -> Infobar
      // note: not using get aliases as they were returning incorrect results
      cy.get(getHandleSelector()).eq(0).should("contain", "Infopic")
      cy.get(getHandleSelector()).eq(1).should("contain", "Infobar")
      cy.get(infopicPreviewSelector)
        .parent()
        .next()
        .should("contain", "Infobar")
    })
  })
})
