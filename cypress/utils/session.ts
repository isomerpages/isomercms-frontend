import { BACKEND_URL, E2E_COOKIE } from "../fixtures/constants"

import { setCookieWithDomain } from "./cookies"

/**
 * The backend checks to see if site exists on the cookie.
 * If it doesn't the user will not be authorised
 * and we use this to remove a users' authorisation.
 */
export const setUserAsUnauthorised = (): void => {
  setCookieWithDomain(E2E_COOKIE.Site.key, "")
  cy.request("GET", `${BACKEND_URL}/auth/whoami`)
}
