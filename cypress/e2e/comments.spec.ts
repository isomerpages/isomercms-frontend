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

const COMMENT_INTERCEPTOR = "getComments"
const COLLABORATOR_INTERCEPTOR = "getCollaborator"

describe("Comments", () => {
  beforeEach(() => {
    cy.setEmailSessionDefaults("Email admin")
    cy.intercept("GET", "**/comments").as(COMMENT_INTERCEPTOR)
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
      checkCommentDisabled()
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
      removeOtherCollaborators()
    })

    // This is required so that subsequent tests do not fail
    // on beforeEach due to a stray 4xx call.
    afterEach(() => {
      cy.intercept("GET", "**/collaborators").as(COLLABORATOR_INTERCEPTOR)
      cy.wait(`@${COLLABORATOR_INTERCEPTOR}`)
      cy.intercept("GET", "**/comments").as(COMMENT_INTERCEPTOR)
      cy.wait(`@${COMMENT_INTERCEPTOR}`)
    })

    it("should not be able to create comments for a site which one is not a site member", () => {
      // Arrange
      cy.setEmailSessionDefaults("Email collaborator")
      setUserAsUnauthorised()

      // Act
      cy.visit(
        `${CMS_BASEURL}/sites/${E2E_EMAIL_TEST_SITE.repo}/review/${reviewId}`
      )
      // NOTE: We need to ignore the errors
      // as the backend recognises that we lack sufficient permissions
      // in order to view this site
      ignoreAuthError()
      ignoreNotFoundError()
      // NOTE: There is a redirect being done
      // but on `localhost`, cypress is fast enough
      // to execute the commands + assertion
      // before the redirect is done

      // Assert
      cy.get(COMMENTS_DRAWER_BUTTON_SELECTOR).should("be.disabled")
    })
    it("should not be able to see comments for a site for which one is not a site member", () => {
      // Arrange
      cy.setEmailSessionDefaults("Email admin")
      createComment(reviewId, MOCK_COMMENT)
      visitE2eEmailTestRepo()
      openReviewRequest()
      cy.wait(`@${COMMENT_INTERCEPTOR}`)
      cy.setEmailSessionDefaults("Email collaborator")
      setUserAsUnauthorised()

      // Act
      cy.visit(
        `${CMS_BASEURL}/sites/${E2E_EMAIL_TEST_SITE.repo}/review/${reviewId}`
      )
      // NOTE: We need to ignore the errors
      // as the backend recognises that we lack sufficient permissions
      // in order to view this site
      ignoreAuthError()
      ignoreNotFoundError()
      // NOTE: There is a redirect being done
      // but on `localhost`, cypress is fast enough
      // to execute the commands + assertion
      // before the redirect is done

      // Assert
      cy.get(COMMENTS_DRAWER_BUTTON_SELECTOR).should("be.disabled")
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
          })
      })
      it("should not be able to see/create comments for merged review requests", () => {
        // Arrange
        cy.setEmailSessionDefaults("Email collaborator")
        api.approveReviewRequest(reviewId)

        cy.setEmailSessionDefaults("Email admin")
        api.mergeReviewRequest(reviewId)

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
          })
      })
      it("should not be able to see/create comments for closed review requests", () => {
        // Arrange
        cy.setEmailSessionDefaults("Email collaborator")
        api.approveReviewRequest(reviewId)

        cy.setEmailSessionDefaults("Email admin")
        api.closeReviewRequest(reviewId)
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
        // Since there is no open review request, visiting the sites dashboard
        // should not show a link to an open review request
        const linkToReviewRequest = `a[href^="/sites/${E2E_EMAIL_TEST_SITE.repo}/review/"]`
        cy.contains(linkToReviewRequest).should("not.exist")
      })
    })
  })
})
