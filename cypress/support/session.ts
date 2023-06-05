import {
  COOKIE_NAME,
  COOKIE_VALUE,
  LOCAL_STORAGE_USER_KEY,
  E2E_USER,
  LOCAL_STORAGE_USERID_KEY,
  E2E_USER_TYPE_COOKIE_KEY,
  E2E_EMAIL_TEST_SITE,
  E2E_SITE_KEY,
  E2E_COOKIE,
  E2E_EMAIL_ADMIN,
} from "../fixtures/constants"
import { EmailUserTypes, USER_TYPES } from "../fixtures/users"

Cypress.Commands.add("setGithubSessionDefaults", () => {
  cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
  cy.setCookie(E2E_USER_TYPE_COOKIE_KEY, USER_TYPES.Github)
  window.localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(E2E_USER))
  window.localStorage.setItem(LOCAL_STORAGE_USERID_KEY, E2E_USER.userId)
})

Cypress.Commands.add("setEmailSessionDefaults", (userType: EmailUserTypes) => {
  cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
  cy.setCookie(E2E_USER_TYPE_COOKIE_KEY, userType)
  cy.setCookie(E2E_SITE_KEY, E2E_EMAIL_TEST_SITE.name)
  cy.setCookie(E2E_COOKIE.Email.key, E2E_EMAIL_ADMIN.email)
})

Cypress.Commands.add(
  "createEmailUser",
  (
    email: string,
    userType: EmailUserTypes,
    initialUserType: EmailUserTypes
  ) => {
    cy.clearCookies()
    cy.setCookie(E2E_COOKIE.Site.key, "")
    cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
    cy.setCookie(E2E_COOKIE.Auth.key, E2E_COOKIE.Auth.value)
    cy.setCookie(E2E_COOKIE.EmailUserType.key, userType)
    cy.setCookie(E2E_COOKIE.Email.key, email)
    cy.request("GET", `${Cypress.env("BACKEND_URL")}/auth/whoami`)

    cy.setEmailSessionDefaults(initialUserType)
    cy.visit(
      `http://localhost:3000/sites/${E2E_EMAIL_TEST_SITE.repo}/dashboard`
    )
  }
)
