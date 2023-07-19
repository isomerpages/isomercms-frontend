import { closeReviewRequests } from "../api"
import {
  E2E_EMAIL_REPO_MASTER_LINK,
  E2E_EMAIL_REPO_STAGING_LINK,
  E2E_EMAIL_TEST_SITE,
  ISOMER_GUIDE_LINK,
  TEST_REPO_NAME,
} from "../fixtures/constants"
import { getOpenStagingButton, visitE2eEmailTestRepo } from "../utils"

const getReviewRequestButton = () => cy.contains("button", "Request a Review")

const getOpenStagingDropdownButton = () =>
  getOpenStagingButton().siblings("button")

const goToWorkspace = () => cy.contains("a", "Edit site").click()

const REVIEW_MODAL_SUBTITLE =
  "An Admin needs to review and approve your changes before they can be published"

const REVIEW_REQUEST_ALERT_MESSAGE =
  "There’s a Review request pending approval. Any changes you make now will be added to the existing Review request, and published with the changes in it."

describe("dashboard flow", () => {
  beforeEach(() => {
    cy.setupDefaultInterceptors()
    cy.setEmailSessionDefaults("Email admin")
    visitE2eEmailTestRepo()
    closeReviewRequests()
  })

  it('should open the staging site on click of the "Open staging" button', () => {
    // Assert
    getOpenStagingButton()
      .should("have.attr", "href", E2E_EMAIL_REPO_STAGING_LINK)
      .should("have.attr", "target", "_blank")
  })

  it('should open the "Request a Review" modal on click of the "Request a Review" button', () => {
    // Act
    getReviewRequestButton().click()

    // Assert
    cy.contains(REVIEW_MODAL_SUBTITLE).should("be.visible")
  })

  it("should be able to navigate to the staging site using the dropdown button", () => {
    // Act
    getOpenStagingDropdownButton().click()

    // Assert
    cy.contains("Open staging site")
      .should("be.visible")
      .should("have.attr", "href", E2E_EMAIL_REPO_STAGING_LINK)
      .should("have.attr", "target", "_blank")
  })

  it("should be able to navigate to the production site using the dropdown button", () => {
    // Act
    getOpenStagingDropdownButton().click()

    // Assert
    cy.contains("Visit live site")
      .should("be.visible")
      .should("have.attr", "href", E2E_EMAIL_REPO_MASTER_LINK)
      .should("have.attr", "target", "_blank")
  })

  it('should navigate to the isomer guide on click of the "Get help" button', () => {
    // Act
    cy.contains("Get help")
      .should("be.visible")
      .should("have.attr", "href", ISOMER_GUIDE_LINK)
      .should("have.attr", "target", "_blank")
  })

  it("should navigate to the settings page when manage site settings is clicked", () => {
    // Act
    cy.contains("Site settings")
      .should("be.visible")
      .parent()
      .parent()
      .siblings("a")
      .should(
        "have.attr",
        "href",
        `/sites/${E2E_EMAIL_TEST_SITE.repo}/settings`
      )
      .click()

    // Assert
    cy.contains("Site settings").should("be.visible")
  })

  it("should navigate to the workspace when edit site is clicked", () => {
    // Act
    cy.contains("Edit site")
      .should("be.visible")
      .should(
        "have.attr",
        "href",
        `/sites/${E2E_EMAIL_TEST_SITE.repo}/workspace`
      )
      .click()

    // Assert
    cy.contains("My Workspace").should("be.visible")
    cy.contains(REVIEW_REQUEST_ALERT_MESSAGE).should("not.exist")
  })
})
