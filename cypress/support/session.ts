import {
  COOKIE_NAME,
  COOKIE_VALUE,
  LOCAL_STORAGE_USER_KEY,
  E2E_USER,
  LOCAL_STORAGE_USERID_KEY,
  E2E_USER_TYPE_COOKIE_KEY,
} from "../fixtures/constants"

Cypress.Commands.add("setGithubSessionDefaults", () => {
  cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
  cy.setCookie(E2E_USER_TYPE_COOKIE_KEY, "Github user")
  window.localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(E2E_USER))
  window.localStorage.setItem(LOCAL_STORAGE_USERID_KEY, E2E_USER.userId)
})

Cypress.Commands.add(
  "setEmailSessionDefaults",
  (userType: "Email admin" | "Email collaborator") => {
    cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
    cy.setCookie(E2E_USER_TYPE_COOKIE_KEY, userType)
    window.localStorage.setItem(
      LOCAL_STORAGE_USER_KEY,
      JSON.stringify(E2E_USER)
    )
    window.localStorage.setItem(LOCAL_STORAGE_USERID_KEY, E2E_USER.userId)
  }
)
