import {
  CMS_BASEURL,
  E2E_EMAIL_ADMIN,
  E2E_EMAIL_COLLAB,
  Interceptors,
  TEST_REPO_NAME,
} from "../fixtures/constants"
import { DELETE_BUTTON_SELECTOR as DELETE_COLLABORATOR_BUTTON_SELECTOR } from "../fixtures/selectors"
import { USER_TYPES } from "../fixtures/users"
import {
  closeModal,
  ignoreDuplicateError,
  ignoreNotFoundError,
  visitE2eEmailTestRepo,
} from "../utils"
import {
  addCollaborator,
  getCollaboratorsModal,
  inputCollaborators,
  removeFirstCollaborator,
} from "../utils/collaborators"

const collaborator = E2E_EMAIL_COLLAB.email

const ADD_COLLABORATOR_ERROR_MESSAGE =
  "This collaborator couldn't be added. Visit our guide for more assistance"

const DUPLICATE_COLLABORATOR_ERROR_MESSAGE =
  "User is already a member of the site"

const NON_EXISTING_USER_ERROR_MESSAGE =
  "This user does not have an Isomer account. Ask them to log in to Isomer and try adding them again."

const removeCollaborator = (email: string) => {
  getCollaboratorsModal()
    .contains("div", email)
    .parent()
    .parent()
    .within(() => {
      cy.get(DELETE_COLLABORATOR_BUTTON_SELECTOR).click()
    })

  cy.contains("button", "Remove collaborator").click().wait(Interceptors.DELETE)
}

// NOTE: The below functions are required because
// the collaborators modal uses the backend's error message
// in order to display the error message to the user.
// This means that we need to ignore the network error
// because it's expected (as the FE queries the BE)
const ignoreAcknowledgementError = (): ReturnType<typeof cy["on"]> =>
  cy.on("uncaught:exception", (err) => !err.message.includes("422"))

const ignoreForbiddenError = () =>
  cy.on("uncaught:exception", (err) => !err.message.includes("403"))

describe("collaborators flow", () => {
  beforeEach(() => {
    cy.setEmailSessionDefaults("Email admin")
    cy.setupDefaultInterceptors()
    visitE2eEmailTestRepo()
  })

  describe("Admin adding a collaborator", () => {
    after(() => removeFirstCollaborator())

    it("should not be able to click the add collaborator button when the input is empty", () => {
      // Act
      // Assert
      getCollaboratorsModal().contains("Add collaborator").should("be.disabled")
    })
    it("should not be able to add a non-whitelisted collaborator", () => {
      // Act
      inputCollaborators("some_gibberish@gmail.com")
      ignoreForbiddenError()

      // Assert
      cy.contains(ADD_COLLABORATOR_ERROR_MESSAGE).should("be.visible")
    })
    it("should not be able to add an existing user", () => {
      // Act
      inputCollaborators(E2E_EMAIL_ADMIN.email)
      ignoreDuplicateError()

      // Assert
      cy.contains(DUPLICATE_COLLABORATOR_ERROR_MESSAGE).should("be.visible")
    })
    it("should not be able to add a collaborator without an isomer account", () => {
      // Act
      // NOTE: Initial admin will always be added manually
      inputCollaborators("gibberish@nonsense.gov.sg")
      ignoreNotFoundError()

      // Assert
      cy.contains(NON_EXISTING_USER_ERROR_MESSAGE).should("be.visible")
    })
    it("should be able to add a collaborator", () => {
      // Arrange
      // NOTE: Mock a login with a collaborator account.
      // This creates the user account in our backend.
      cy.createEmailUser(
        collaborator,
        USER_TYPES.Email.Collaborator,
        USER_TYPES.Email.Admin
      )

      // Act
      // NOTE: Not using the `addCollaborator` function
      // as we want to assert that the continue button is disabled
      inputCollaborators(collaborator)
      // NOTE: Cannot proceed without acknowledgement
      cy.contains("Continue").should("be.disabled")
      cy.get("input[name='isAcknowledged']").next().click()
      cy.contains("Continue").click().wait(Interceptors.POST)
      ignoreAcknowledgementError()
      closeModal()

      // Assert
      cy.get("form").contains(collaborator).should("be.visible")
      cy.get("form").contains("Contributor").should("be.visible")
    })
  })

  describe("Admin removing a collaborator", () => {
    it("should be able to remove an existing collaborator", () => {
      // Arrange
      addCollaborator(collaborator)

      // Act
      removeCollaborator(collaborator)
      closeModal()

      // Assert
      cy.contains("Collaborator removed successfully").should("be.visible")
    })

    it("should not be able to remove the last site member", () => {
      // Act
      // NOTE: Remove all collaborators except the initial admin
      removeFirstCollaborator()

      // Assert
      cy.get(DELETE_COLLABORATOR_BUTTON_SELECTOR).should("be.disabled")
    })

    it("should prevent admins of a site from removing collaborators of another site", () => {
      // Arrange
      cy.visit(`${CMS_BASEURL}/sites/${TEST_REPO_NAME}/dashboard`)
      cy.contains(TEST_REPO_NAME).should("be.visible")
      ignoreNotFoundError()

      // Act
      getCollaboratorsModal()
        .contains("button", "Add collaborator")
        .should("be.disabled")
    })
  })
})
