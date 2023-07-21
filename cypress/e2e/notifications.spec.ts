import * as api from "../api"
import {
  E2E_EMAIL_ADMIN,
  E2E_EMAIL_COLLAB,
  E2E_EMAIL_TEST_SITE,
} from "../fixtures/constants"
import {
  genRandomString,
  getNotificationList,
  getNotificationsButton,
  visitE2eEmailTestRepo,
} from "../utils"

const UNREAD_COMMENTS_BG_COLOR = "rgb(235, 248, 255)"
const READ_COMMENTS_BG_COLOR = "rgba(0, 0, 0, 0)"

const getReviewRequestedNotifText = (email: string) =>
  `${email} has sent you a review request.`

const getChangesMadeNotifText = (email: string) =>
  `${email} made changes to a review request.`

const getApprovedReviewRequestNotifText = (email: string) =>
  `${email} has approved a review request.`

const getMergedReviewRequestNotifText = (email: string) =>
  `${email} has published a review request.`

const getReviewCancelledNotifText = (email: string) =>
  `${email} has cancelled a review request.`

const getNewNotifBadge = () =>
  getNotificationsButton().within(() => {
    cy.get(".chakra-avatar").within(() => {
      cy.get("div")
    })
  })

describe("notifications", () => {
  let reviewId: number
  beforeEach(() => {
    cy.setEmailSessionDefaults("Email admin")
    cy.setupDefaultInterceptors()
    visitE2eEmailTestRepo()
  })
  before(() => {
    cy.createEmailUser(
      E2E_EMAIL_COLLAB.email,
      "Email admin",
      "Email admin",
      E2E_EMAIL_TEST_SITE.name
    )
    // NOTE: Need to set permissions as order is `before` -> `beforeEach`
    visitE2eEmailTestRepo()
    // NOTE: Mark all notifications as read as email collab.
    // This is because previous tests may have created notifications.
    api.markNotificationsAsRead()

    cy.setEmailSessionDefaults("Email admin")
    cy.setupDefaultInterceptors()
    api.closeReviewRequests()
    // NOTE: Mark all notifications as read as email admin.
    // We need to do this again because our cookies are now set
    // to that of the admin account whereas it was collab previously.
    api.markNotificationsAsRead()

    api.editUnlinkedPage("faq.md", genRandomString(), E2E_EMAIL_TEST_SITE.repo)
    api
      .createReviewRequest("test title", [E2E_EMAIL_COLLAB.email])
      .then((id) => {
        reviewId = id
      })
  })
  it("should not create a notification for the user who created the review request", () => {
    // Act
    getNotificationsButton().click()

    // NOTE: We don't check for the existence of no notifications as
    // we want the tests to be idempotent
    // Assert
    getNotificationList().should(
      "have.css",
      "background-color",
      READ_COMMENTS_BG_COLOR
    )
  })
  it("should receive a notification on successful creation of a review request", () => {
    // Arrange
    cy.setEmailSessionDefaults("Email collaborator")
    // NOTE: we only refetch on a refresh, so we need to revisit the dashboard
    visitE2eEmailTestRepo()

    // Act
    // NOTE: This is the little red button that shows when there are unread notifications
    getNewNotifBadge().should("be.visible")
    getNotificationsButton().click()

    // Assert
    cy.contains(getReviewRequestedNotifText(E2E_EMAIL_ADMIN.email))
      .should("be.visible")
      .should("have.css", "background-color", UNREAD_COMMENTS_BG_COLOR)
  })
  it("should send out a notification to reviewers when someone edits the site while a PR is open", () => {
    // Arrange
    cy.setEmailSessionDefaults("Email collaborator")
    visitE2eEmailTestRepo()
    api.editUnlinkedPage(
      "privacy.md",
      genRandomString(),
      E2E_EMAIL_TEST_SITE.repo
    )
    // NOTE: Editor should not see a notification
    getNotificationsButton().click()
    getNotificationList().should(
      "have.css",
      "background-color",
      READ_COMMENTS_BG_COLOR
    )
    // NOTE: All other reviewers should see a notification
    cy.setEmailSessionDefaults("Email admin")
    visitE2eEmailTestRepo()
    // Assert
    getNotificationsButton().click()
    cy.contains(getChangesMadeNotifText(E2E_EMAIL_COLLAB.email))
      .should("be.visible")
      .should("have.css", "background-color", UNREAD_COMMENTS_BG_COLOR)
  })
  it("should receive a notification on successful comment post", () => {
    // Arrange
    cy.setEmailSessionDefaults("Email collaborator")
    visitE2eEmailTestRepo()
    api.createComment(reviewId, "test comment")
    // Act
    cy.setEmailSessionDefaults("Email admin")
    visitE2eEmailTestRepo()
    // Assert
    getNotificationsButton().click()
    cy.contains(getChangesMadeNotifText(E2E_EMAIL_COLLAB.email))
      .should("be.visible")
      .should("have.css", "background-color", UNREAD_COMMENTS_BG_COLOR)
  })
  it("should receive a notification on approval of a review request", () => {
    // Arrange
    cy.setEmailSessionDefaults("Email collaborator")
    visitE2eEmailTestRepo()
    api.approveReviewRequest(reviewId)

    // Act
    cy.setEmailSessionDefaults("Email admin")
    visitE2eEmailTestRepo()
    getNotificationsButton().click()

    // Assert
    cy.contains(getApprovedReviewRequestNotifText(E2E_EMAIL_COLLAB.email))
      .should("be.visible")
      .should("have.css", "background-color", UNREAD_COMMENTS_BG_COLOR)
  })

  it("should receive a notification on merge of review request", () => {
    // Arrange
    cy.setEmailSessionDefaults("Email admin")
    api.mergeReviewRequest(reviewId)

    // Act
    cy.setEmailSessionDefaults("Email collaborator", "collab@e2e.gov.sg")
    visitE2eEmailTestRepo()
    getNotificationsButton().click()

    // Assert
    cy.contains(getMergedReviewRequestNotifText(E2E_EMAIL_COLLAB.email))
      .should("be.visible")
      .should("have.css", "background-color", UNREAD_COMMENTS_BG_COLOR)
  })
  it("should not send a notification if the user is a github user", () => {
    // Arrange
    cy.setGithubSessionDefaults()

    // Act
    // NOTE: this would have a redirect since GH users don't have a dashboard
    visitE2eEmailTestRepo()

    // Assert
    // Button should not exist
    getNotificationsButton().should("throw")
  })
  it("should receive a notification on closing of review request", () => {
    // Arrange
    api.closeReviewRequest(reviewId)
    // Act
    cy.setEmailSessionDefaults("Email collaborator")
    visitE2eEmailTestRepo()
    // Assert
    getNotificationsButton().click()
    cy.contains(getReviewCancelledNotifText(E2E_EMAIL_ADMIN.email))
  })
  it("should mark all notifications as read on clicking the button", () => {
    // Arrange
    getNotificationsButton().click()
    visitE2eEmailTestRepo()
    // Act
    getNotificationsButton().click()
    // Assert
    getNotificationList().should(
      "have.css",
      "background-color",
      READ_COMMENTS_BG_COLOR
    )
  })
})
