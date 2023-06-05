import {
  E2E_EMAIL_ADMIN,
  E2E_EMAIL_COLLAB,
  E2E_EMAIL_TEST_SITE,
  Interceptors,
} from "../fixtures/constants"
import { USER_TYPES } from "../fixtures/users"

const collaborator = E2E_EMAIL_COLLAB.email

const ignoreAcknowledgementError = () =>
  cy.on("uncaught:exception", (err) => !err.message.includes("422"))

const ignoreDuplicateError = () =>
  cy.on("uncaught:exception", (err) => !err.message.includes("409"))

const ignoreNotFoundError = () =>
  cy.on("uncaught:exception", (err) => !err.message.includes("404"))

const ADD_COLLABORATOR_ERROR_MESSAGE =
  "This collaborator couldn't be added. Visit our guide for more assistance"

const DUPLICATE_COLLABORATOR_ERROR_MESSAGE =
  "User is already a member of the site"

const NON_EXISTING_USER_ERROR_MESSAGE =
  "This user does not have an Isomer account. Ask them to log in to Isomer and try adding them again."

const ADD_COLLABORATOR_INPUT_SELECTOR = "input[name='newCollaboratorEmail']"

const visitE2eEmailTestRepo = () => {
  cy.visit(`http://localhost:3000/sites/${E2E_EMAIL_TEST_SITE.repo}/dashboard`)
  cy.contains(E2E_EMAIL_TEST_SITE.repo).should("be.visible")
}

const getCollaboratorsModal = () => {
  cy.contains("Site collaborators")
    .parent()
    .parent()
    .parent()
    .within(() => cy.get("button").click())

  // NOTE: the form encloses the displayed modal component
  return cy.get("form").should("be.visible")
}

const addCollaboratorsFor = (user: string) => {
  getCollaboratorsModal().get(ADD_COLLABORATOR_INPUT_SELECTOR).type(user).blur()
  // NOTE: need to ignore the 422 w/ specific error message because we haven't ack yet
  cy.contains("Add collaborator").click().wait(Interceptors.POST)
}

const removeCollaborator = (email: string) => {
  cy.get("form")
    .contains("div", email)
    .parent()
    .parent()
    .within(() => {
      cy.get('button[id^="delete-"]').click()
    })

  cy.contains("button", "Remove collaborator").click().wait(Interceptors.DELETE)
}

describe("collaborators flow", () => {
  beforeEach(() => {
    cy.setEmailSessionDefaults("Email admin")
    cy.setupDefaultInterceptors()
    visitE2eEmailTestRepo()
  })

  describe("Admin adding a collaborator", () => {
    it("should not be able to click the add collaborator button when the input is empty", () => {
      // Act
      // Assert
      getCollaboratorsModal().contains("Add collaborator").should("be.disabled")
    })
    it("should not be able to add a non-whitelisted collaborator", () => {
      // Act
      addCollaboratorsFor("some_gibberish@gmail.com")

      // Assert
      cy.contains(ADD_COLLABORATOR_ERROR_MESSAGE).should("be.visible")
    })
    it("should not be able to add an existing user", () => {
      // Act
      addCollaboratorsFor(E2E_EMAIL_ADMIN.email)
      ignoreDuplicateError()

      // Assert
      cy.contains(DUPLICATE_COLLABORATOR_ERROR_MESSAGE).should("be.visible")
    })
    it("should not be able to add a collaborator without an isomer account", () => {
      // Act
      // NOTE: Initial admin will always be added manually
      addCollaboratorsFor("gibberish@nonsense.gov.sg")
      ignoreNotFoundError()

      // Assert
      cy.contains(NON_EXISTING_USER_ERROR_MESSAGE).should("be.visible")
    })
    it("should be able to add a collaborator", () => {
      // Arrange
      // NOTE: Mock a login with a collaborator account;
      // This creates the user account in our backend.
      cy.createEmailUser(
        collaborator,
        USER_TYPES.Email.Collaborator,
        USER_TYPES.Email.Admin
      )

      // Act
      // NOTE: Initial admin will always be added manually
      addCollaboratorsFor(collaborator)
      // NOTE: Cannot proceed without acknowledgement
      cy.contains("Continue").should("be.disabled")
      cy.get("input[name='isAcknowledged']").next().click()
      cy.contains("Continue").click().wait(Interceptors.POST)
      ignoreAcknowledgementError()

      // Assert
      cy.get("form").contains(collaborator).should("be.visible")
      cy.get("form").contains("Contributor").should("be.visible")

      // Cleanup
      removeCollaborator(collaborator)
    })
  })
})
