import {
  addAdmin,
  approveReviewRequest,
  closeReviewRequests,
  createReviewRequest,
  listReviewRequests,
} from "../api"
import { editUnlinkedPage } from "../api/pages.api"
import {
  E2E_EMAIL_COLLAB,
  E2E_EMAIL_REPO_STAGING_LINK,
  E2E_EMAIL_TEST_SITE,
  MOCK_REVIEW_DESCRIPTION,
  MOCK_REVIEW_TITLE,
} from "../fixtures/constants"
import { USER_TYPES } from "../fixtures/users"
import {
  addCollaborator,
  removeOtherCollaborators,
  visitE2eEmailTestRepo,
} from "../utils"

const getReviewRequestButton = () => cy.contains("button", "Request a Review")
const getSubmitReviewButton = () => cy.contains("button", "Submit Review")

const selectReviewer = (email: string) => {
  cy.get("div[id^='react-select']").contains(E2E_EMAIL_COLLAB.email).click()
}
const removeReviewers = () => cy.get('div[aria-label^="Remove"]').click()

const TITLE_INPUT_SELECTOR =
  "input[placeholder='Title your request'][name='title']"
const DESCRIPTION_TEXTAREA_SELECTOR =
  "textarea[name='description'][placeholder='Briefly describe the changes you’ve made, and add a review deadline (if applicable)']"

const getAddReviewerDropdown = () =>
  cy.contains("Select Admins to add as reviewers").parent()

const REVIEW_MODAL_SUBTITLE =
  "An Admin needs to review and approve your changes before they can be published"

describe("Review Requests", () => {
  before(() => {
    cy.setEmailSessionDefaults("Email admin")
    closeReviewRequests()
  })
  beforeEach(() => {
    cy.setupDefaultInterceptors()
    cy.setEmailSessionDefaults("Email admin")
    visitE2eEmailTestRepo()
  })
  describe("create review request", () => {
    beforeEach(() => {
      // NOTE: We want to start this test suite on a clean slate
      // and prevent other tests from interfering
      removeOtherCollaborators()
    })

    it("should not be able to create a review request when the site has 1 collaborator", () => {
      // Arrange
      getReviewRequestButton().click()
      cy.contains(REVIEW_MODAL_SUBTITLE).should("be.visible")

      // Act
      getAddReviewerDropdown().click()

      // Assert
      cy.contains("No options").should("be.visible")
    })
    it("should not be able to create a review request without a reviewer", () => {
      // Arrange
      cy.createEmailUser(
        E2E_EMAIL_COLLAB.email,
        USER_TYPES.Email.Collaborator,
        USER_TYPES.Email.Admin
      )
      addCollaborator(E2E_EMAIL_COLLAB.email)

      // Act
      // NOTE: There should be at least 1 other admin to be able to create a review request
      getReviewRequestButton().click()
      cy.contains(REVIEW_MODAL_SUBTITLE).should("be.visible")

      // Assert
      getAddReviewerDropdown().click()
      cy.contains("No options").should("be.visible")
    })
    it.skip("should not be able to create a review request when there are no changes", () => {
      // Arrange
      // Act
      // Assert
      throw new Error("Not implemented")
    })
    it("should be able to create a review request successfully", () => {
      // Arrange
      addAdmin(E2E_EMAIL_COLLAB.email)
      editUnlinkedPage(
        "faq.md",
        "some asdfasdfasdf content",
        E2E_EMAIL_TEST_SITE.repo
      )

      // Act
      getReviewRequestButton().click()
      cy.contains(REVIEW_MODAL_SUBTITLE).should("be.visible")
      cy.get(TITLE_INPUT_SELECTOR).type(MOCK_REVIEW_TITLE)
      // NOTE: should not allow submitting of review prior to selecting reviewer
      getSubmitReviewButton().should("be.disabled")
      getAddReviewerDropdown().click()
      // select reviewer and click
      selectReviewer(E2E_EMAIL_COLLAB.email)
      removeReviewers()
      getSubmitReviewButton().should("be.disabled")
      // add back reviewer
      getAddReviewerDropdown().click()
      selectReviewer(E2E_EMAIL_COLLAB.email)
      cy.get(DESCRIPTION_TEXTAREA_SELECTOR).type(MOCK_REVIEW_DESCRIPTION)

      // Assert
      getSubmitReviewButton().click()
      cy.contains("Review request submitted").should("be.visible")
    })
  })
  describe.skip("has pending review requests", () => {
    before(() => {
      addAdmin(E2E_EMAIL_COLLAB.email)
      // NOTE: Create a review request if none exists
      listReviewRequests().then((requests) => {
        if (!requests || !requests.length) {
          createReviewRequest(
            MOCK_REVIEW_TITLE,
            [E2E_EMAIL_COLLAB.email],
            MOCK_REVIEW_DESCRIPTION
          )
        }
      })
    })
    it("should have the pending review alert on the workspace", () => {
      // Arrange
      // Act
      // Assert
    })
    it("should prevent the requestor from approving their own review request", () => {
      // Arrange
      // Act
      // Assert
    })
    it('should show the review request on the workspace with the tag "Pending review"', () => {
      // Arrange
      // Act
      // Assert
    })
    it("should have changes reflected in the currently open review request", () => {
      // Arrange
      // TODO: If this is hard, maybe we can just do delete + add content + have new page
      // NOTE: We define changes as being
      // 1. Adding a new page
      // 2. Editing an existing page
      // 3. Deleting an existing page
      // 4. Rename an existing page
      // 5. Moving an existing page
      // Act
      // Assert
    })
    it("should be able to have the request approved as a collaborator", () => {
      // Arrange
      cy.setEmailSessionDefaults("Email collaborator")
      // Act
      // Assert
    })
  })
  describe.skip("has approved review requests", () => {
    before(() => {
      addAdmin(E2E_EMAIL_COLLAB.email)
      // NOTE: Create a review request if none exists
      listReviewRequests().then((requests) => {
        if (!requests || !requests.length) {
          createReviewRequest(
            MOCK_REVIEW_TITLE,
            [E2E_EMAIL_COLLAB.email],
            MOCK_REVIEW_DESCRIPTION
          ).then((id) => approveReviewRequest(id))
        }
      })
    })
    it("should have the review request approved alert stating that editing is disabled when on the workspace", () => {
      // Arrange
      // Act
      // Assert
    })
    it("should show the review request as being approved on the dashboard", () => {
      // Arrange
      // Act
      // Assert
    })
    it("should prevent edits while the request is not merged", () => {
      // Arrange
      // Act
      // Assert
    })
    it("should allow the requestor to merge the review request", () => {
      // Arrange
      // Act
      // Assert
    })
    it("should allow the reviewer to merge the review request", () => {
      // Arrange
      // Act
      // Assert
    })
  })
  describe.skip("changing review request states", () => {
    it("should allow the reviewer to unapprove the request", () => {
      // Arrange
      // Act
      // Assert
    })
    it("should allow the requestor to close the review request", () => {
      // Arrange
      // Act
      // Assert
    })
    it("should disallow users from viewing a closed review request", () => {
      // Arrange
      // Act
      // Assert
    })
    it("should disallow users from viewing a merged review request", () => {
      // Arrange
      // Act
      // Assert
    })
  })
})
