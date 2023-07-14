import * as api from "../api"
import { createComment } from "../api"
import {
  CMS_BASEURL,
  E2E_EMAIL_ADMIN,
  E2E_EMAIL_COLLAB,
  E2E_EMAIL_TEST_SITE,
} from "../fixtures/constants"
import {
  COMMENTS_DRAWER_BUTTON_SELECTOR,
  SUBMIT_COMMENT_BUTTON_SELECTOR,
} from "../fixtures/selectors/dashboard"
import {
  ignoreAuthError,
  ignoreNotFoundError,
  openCommentsDrawer,
  openReviewRequest,
  removeOtherCollaborators,
  setUserAsUnauthorised,
  visitE2eEmailTestRepo,
  getCommentInput,
  submitNewComment,
} from "../utils"

const MOCK_COMMENT = "mock comment"

// NOTE: Some of our tests flake due to resizing.
// This was not observed when performed manually and hence,
// the error is ignored.
const ignoreResizeError = () =>
  cy.on("uncaught:exception", (err) => !err.message.includes("ResizeObserver"))

const checkCommentVisible = (
  commentText: string,
  userEmail: string
): Cypress.Chainable<JQuery<HTMLElement>> => {
  return cy
    .contains("div", commentText)
    .should("be.visible")
    .parent()
    .contains(userEmail)
    .should("be.visible")
}

const checkCommentDisabled = () =>
  cy.get(COMMENTS_DRAWER_BUTTON_SELECTOR).should("be.disabled")

const USER_NOT_AUTHORISED_COMMENT_ERROR_MESSAGE =
  "Only collaborators of a site can view review request comments!"
const NOTIFICATION_CANNOT_BE_RETRIVED_ERROR_MESSAGE =
  "Your notifications could not be retrieved. Please try again or check your internet connection"

const COMMENT_INTERCEPTOR = "getComments"

describe("Comments", () => {
  beforeEach(() => {
    cy.setEmailSessionDefaults("Email admin")
    cy.intercept("GET", "**/comments").as(COMMENT_INTERCEPTOR)
    cy.setupDefaultInterceptors()
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
      checkCommentVisible(MOCK_COMMENT, E2E_EMAIL_COLLAB.email)
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
      checkCommentVisible(MOCK_COMMENT, E2E_EMAIL_ADMIN.email)
    })

    it("should not allow empty comments to be posted", () => {
      // Arrange
      visitE2eEmailTestRepo()

      // Act
      openReviewRequest()
      cy.wait(`@${COMMENT_INTERCEPTOR}`)
      ignoreResizeError()
      openCommentsDrawer()
      getCommentInput().type(MOCK_COMMENT).clear().blur()

      // Assert
      cy.get(SUBMIT_COMMENT_BUTTON_SELECTOR).should("be.disabled")
    })
  })

  describe("admin and collaborator of site", () => {
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
      api.createReviewRequest("test title", [E2E_EMAIL_COLLAB.email])
    })

    it("should be able to post comments if you are an admin of the site", () => {
      // Arrange
      cy.setEmailSessionDefaults("Email admin")
      visitE2eEmailTestRepo()

      // Act
      openReviewRequest()
      cy.wait(`@${COMMENT_INTERCEPTOR}`)
      ignoreResizeError()
      openCommentsDrawer()
      getCommentInput().type(MOCK_COMMENT).blur()
      submitNewComment()

      // Assert
      checkCommentVisible(MOCK_COMMENT, E2E_EMAIL_ADMIN.email)
    })
    it("should be able to post comments if you are a collaborator of the site", () => {
      // Arrange
      cy.setEmailSessionDefaults("Email collaborator")
      visitE2eEmailTestRepo()

      // Act
      openReviewRequest()
      cy.wait(`@${COMMENT_INTERCEPTOR}`)
      ignoreResizeError()
      openCommentsDrawer()
      getCommentInput().type(MOCK_COMMENT).blur()
      submitNewComment()

      // Assert
      checkCommentVisible(MOCK_COMMENT, E2E_EMAIL_COLLAB.email)
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

        // // Assert
        cy.get(COMMENTS_DRAWER_BUTTON_SELECTOR).should("be.disabled")
      })
      it("should not be able to see comments for a site for which one is not a site member", () => {
        // Arrange
        cy.setEmailSessionDefaults("Email admin")
        createComment(reviewId, MOCK_COMMENT)
        cy.setEmailSessionDefaults("Email collaborator")
        setUserAsUnauthorised()

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

        // // Assert
        cy.get(COMMENTS_DRAWER_BUTTON_SELECTOR).should("be.disabled")
      })
    })
  })

  describe("invalid review request", () => {
    describe("merged review requests", () => {
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
            cy.setEmailSessionDefaults("Email collaborator")
            api.approveReviewRequest(reviewId).then((response) => {
              cy.setEmailSessionDefaults("Email admin")
              api.mergeReviewRequest(reviewId)
            })
          })
      })
      it("should not be able to see/create comments for merged review requests", () => {
        // Arrange
        // Act
        cy.visit(
          `${CMS_BASEURL}/sites/${E2E_EMAIL_TEST_SITE.repo}/review/${reviewId}`
        )

        // Assert
        checkCommentDisabled()
      })
    })

    describe("closed review requests", () => {
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
            cy.setEmailSessionDefaults("Email collaborator")
            api.approveReviewRequest(reviewId).then((response) => {
              cy.setEmailSessionDefaults("Email admin")
              api.mergeReviewRequest(reviewId)
            })
          })
      })
      it("should not be able to see/create comments for closed review requests", () => {
        // Arrange
        // Act
        cy.visit(
          `${CMS_BASEURL}/sites/${E2E_EMAIL_TEST_SITE.repo}/review/${reviewId}`
        )
        // Assert
        checkCommentDisabled()
      })
    })

    describe("non-existent review requests", () => {
      before(() => {
        cy.setEmailSessionDefaults("Email admin")
        api.closeReviewRequests()
      })
      it("should not be able to see/create comments for non-existent review requests", () => {
        // Arrange
        visitE2eEmailTestRepo()

        // Act

        // Assert
        cy.contains(
          `a[href^="/sites/${E2E_EMAIL_TEST_SITE.repo}/review/"]`
        ).should("not.exist")
      })
    })
  })
})
