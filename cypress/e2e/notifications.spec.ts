import * as api from "../api"
import {
  E2E_EMAIL_ADMIN,
  E2E_EMAIL_COLLAB,
  E2E_EMAIL_TEST_SITE,
} from "../fixtures/constants"
import {
  genRandomString,
  getNotificationsButton,
  visitE2eEmailTestRepo,
} from "../utils"

const NEW_COMMENTS_BG_COLOR = "rgb(235, 248, 255)"
const EMPTY_NOTIFICATIONS_TEXT = "There are no notifications for display."
const getReviewRequestedNotifText = (email: string) =>
  `${email} has sent you a review request.`

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

    // Assert
    cy.contains(EMPTY_NOTIFICATIONS_TEXT).should("be.visible")
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
      .should("have.css", "background-color", NEW_COMMENTS_BG_COLOR)
  })
  it("should receive a notification on successful comment post", () => {
    // Arrange
    // Act
    // Assert
  })
  it("should receive a notification on approval of a review request", () => {
    // Arrange
    // Act
    // Assert
  })
  it("should receive a notification on merge of review request", () => {
    // Arrange
    // Act
    // Assert
  })
  it("should not send a notification if the user is a github user", () => {
    // Arrange
    // Act
    // Assert
  })
  it("should receive a notification on closing of review request", () => {
    // Arrange
    // Act
    // Assert
  })
  it("should mark all notifications as read on clicking the button", () => {
    // Arrange
    // Act
    // Assert
  })
})
