import * as api from "../api"
import { createComment } from "../api"
import {
  CMS_BASEURL,
  E2E_EMAIL_ADMIN,
  E2E_EMAIL_COLLAB,
  E2E_EMAIL_TEST_SITE,
} from "../fixtures/constants"
import {
  SUBMIT_COMMENT_BUTTON_SELECTOR,
  COMMENTS_INPUT_SELECTOR,
} from "../fixtures/selectors/dashboard"
import {
  ignoreAuthError,
  ignoreNotFoundError,
  openCommentsDrawer,
  openReviewRequest,
  removeOtherCollaborators,
  setUserAsUnauthorised,
  visitE2eEmailTestRepo,
} from "../utils"

const MOCK_COMMENT = "mock comment"

// NOTE: Some of our tests flake due to resizing.
// This was not observed when performed manually and hence,
// the error is ignored.
const ignoreResizeError = () =>
  cy.on("uncaught:exception", (err) => !err.message.includes("ResizeObserver"))

const USER_NOT_AUTHORISED_COMMENT_ERROR_MESSAGE =
  "Only collaborators of a site can view review request comments!"

const submitComment = () => cy.get(SUBMIT_COMMENT_BUTTON_SELECTOR).click()
const COMMENT_INTERCEPTOR = "getComments"

describe("Comments", () => {
  beforeEach(() => {
    cy.setEmailSessionDefaults("Email admin")
    cy.setupDefaultInterceptors()
    visitE2eEmailTestRepo()
  })

  describe("common", () => {
    let reviewId: number
    before(() => {
      cy.intercept("GET", "**/comments").as(COMMENT_INTERCEPTOR)
      // NOTE: Need to set permissions as order is `before` -> `beforeEach`
      cy.setEmailSessionDefaults("Email admin")
      cy.setupDefaultInterceptors()
      api.closeReviewRequests()
      cy.createEmailUser(
        E2E_EMAIL_COLLAB.email,
        "Email admin",
        "Email admin",
        E2E_EMAIL_TEST_SITE.name
      )
      api.editUnlinkedPage("faq.md", "some content", E2E_EMAIL_TEST_SITE.repo)
      api
        .createReviewRequest("test title", [E2E_EMAIL_COLLAB.email])
        .then((id) => {
          reviewId = id
        })
    })
    it("should be able to see comments posted by others", () => {
      // Arrange
      // NOTE: Create comment via collab account
      cy.setEmailSessionDefaults("Email collaborator")
      createComment(reviewId, MOCK_COMMENT)
      // NOTE: Swap back to admin
      cy.setEmailSessionDefaults("Email admin")
      // NOTE: we only refetch on a refresh, so we need to revisit the dashboard
      visitE2eEmailTestRepo()

      // Act
      cy.contains("new comment").should("be.visible")
      openReviewRequest()
      cy.wait(`@${COMMENT_INTERCEPTOR}`)
      ignoreResizeError()
      openCommentsDrawer()

      // Assert
      cy.contains("div", MOCK_COMMENT)
        .should("be.visible")
        .parent()
        .contains(E2E_EMAIL_COLLAB.email)
        .should("be.visible")
    })
    it("should be able to see comments posted by yourself", () => {
      // Arrange
      createComment(reviewId, MOCK_COMMENT)
      // NOTE: we only refetch on a refresh, so we need to revisit the dashboard
      visitE2eEmailTestRepo()

      // Act
      cy.contains("new comment").should("be.visible")
      openReviewRequest()
      cy.wait(`@${COMMENT_INTERCEPTOR}`)
      ignoreResizeError()
      openCommentsDrawer()

      // Assert
      cy.contains("div", MOCK_COMMENT)
        .should("be.visible")
        .parent()
        .contains(E2E_EMAIL_ADMIN.email)
        .should("be.visible")
    })
    it("should not allow empty comments to be posted", () => {
      // Arrange
      // Act
      // Assert
    })
  })

  describe("admin of site", () => {
    it("should be able to post comments if you are an admin of the site", () => {
      // Arrange
      // Act
      // Assert
    })
  })

  describe("collaborator of site", () => {
    it("should be able to post comments if you are a collaborator of the site", () => {
      // Arrange
      // Act
      // Assert
    })
  })

  describe("no access rights", () => {
    let reviewId: number
    before(() => {
      // NOTE: Need to set permissions as order is `before` -> `beforeEach`
      cy.setEmailSessionDefaults("Email admin")
      cy.setupDefaultInterceptors()
      api.closeReviewRequests()
      cy.createEmailUser(
        E2E_EMAIL_COLLAB.email,
        "Email admin",
        "Email admin",
        E2E_EMAIL_TEST_SITE.name
      )
      api.editUnlinkedPage("faq.md", "some content", E2E_EMAIL_TEST_SITE.repo)
      api
        .createReviewRequest("test title", [E2E_EMAIL_COLLAB.email])
        .then((id) => {
          reviewId = id
        })
    })

    describe("not a site member", () => {
      before(() => {
        removeOtherCollaborators()
      })
      beforeEach(() => {
        cy.setEmailSessionDefaults("Email collaborator")
        setUserAsUnauthorised()
      })

      it("should not be able to create comments for a site which one is not a site member", () => {
        // Arrange
        cy.visit(
          `${CMS_BASEURL}/sites/${E2E_EMAIL_TEST_SITE.repo}/review/${reviewId}`
        )

        // Act
        // NOTE: We need to ignore the errors
        // as the backend recognises that we lack sufficient permissions
        // in order to view this site
        ignoreAuthError()
        ignoreNotFoundError()
        // NOTE: There is a redirect being done
        // but on `localhost`, cypress is fast enough
        // to execute the commands + assertion
        // before the redirect is done
        openCommentsDrawer()
        cy.get(COMMENTS_INPUT_SELECTOR).type(MOCK_COMMENT).blur()
        submitComment()

        // Assert
        cy.contains(USER_NOT_AUTHORISED_COMMENT_ERROR_MESSAGE).should(
          "be.visible"
        )
      })
      it("should not be able to see comments for a site for which one is not a site member", () => {
        // Arrange
        // Act
        // Assert
      })
    })
    describe("invalid review requests", () => {
      it("should not be able to see comments for merged review requests", () => {
        // Arrange
        // Act
        // Assert
      })
      it("should not be able to see comments for closed review requests", () => {
        // Arrange
        // Act
        // Assert
      })
      it("should not be able to create comments for merged review requests", () => {
        // Arrange
        // Act
        // Assert
      })
      it("should not be able to create comments for closed review requests", () => {
        // Arrange
        // Act
        // Assert
      })
      it("should not be able to create comments for a non-existent review request", () => {
        // Arrange
        // Act
        // Assert
      })
    })
  })
})
