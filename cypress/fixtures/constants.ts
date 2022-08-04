/**
 * Default wait time for changes that do not to be reflected on the site
 */
export const E2E_DEFAULT_WAIT_TIME = 2000

export const E2E_EXTENDED_TIMEOUT = 30000

export const COOKIE_NAME: string | undefined = Cypress.env("COOKIE_NAME")
export const COOKIE_VALUE: string | undefined = Cypress.env("COOKIE_VALUE")
export const E2E_USER = {
  userId: "test",
  email: "test@open.gov.sg",
  contactNumber: "99999999",
}
export const LOCAL_STORAGE_USERID_KEY = "userId"
export const LOCAL_STORAGE_USER_KEY = "user"
export const TEST_REPO_NAME: string | undefined = Cypress.env("TEST_REPO_NAME")
export const TEST_PRIMARY_COLOR = [255, 0, 0]
