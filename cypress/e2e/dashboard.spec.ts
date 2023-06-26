import { closeReviewRequests } from "../api"
import { E2E_EMAIL_REPO_STAGING_LINK } from "../fixtures/constants"
import { getOpenStagingButton, visitE2eEmailTestRepo } from "../utils"

const getReviewRequestButton = () => cy.contains("button", "Request a Review")

const goToWorkspace = () => cy.contains("a", "Edit site").click()

const REVIEW_MODAL_SUBTITLE =
  "An Admin needs to review and approve your changes before they can be published"

describe("dashboard flow", () => {
  beforeEach(() => {
    cy.setupDefaultInterceptors()
    cy.setEmailSessionDefaults("Email admin")
    visitE2eEmailTestRepo()
    closeReviewRequests()
  })

  it('should open the staging site on click of the "Open staging" button', () => {
    // Act
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
  it.skip("should be able to navigate to the staging site using the dropdown button", () => {
    throw new Error("Not implemented")
  })
  it.skip("should be able to navigate to the production site using the dropdown button", () => {
    throw new Error("Not implemented")
  })
  it.skip('should navigate to the isomer guide on click of the "Get help" button', () => {
    throw new Error("Not implemented")
  })
  it.skip("should navigate to the settings page when manage site settings is clicked", () => {
    throw new Error("Not implemented")
  })
  it.skip("should navigate to the workspace when edit site is clicked", () => {
    // Arrange
    // NOTE: There shouldn't be a review request alert
    // Act
    // Assert
    throw new Error("Not implemented")
  })
})
