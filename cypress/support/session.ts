import {
  COOKIE_NAME,
  COOKIE_VALUE,
  LOCAL_STORAGE_USER_KEY,
  E2E_USER,
  LOCAL_STORAGE_USERID_KEY,
} from "../fixtures/constants"

Cypress.Commands.add("setSessionDefaults", () => {
  cy.setCookie(COOKIE_NAME, COOKIE_VALUE)
  window.localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(E2E_USER))
  window.localStorage.setItem(LOCAL_STORAGE_USERID_KEY, E2E_USER.userId)
})
