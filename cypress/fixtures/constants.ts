export const COOKIE_NAME: string | undefined = Cypress.env("COOKIE_NAME")
export const COOKIE_VALUE: string | undefined = Cypress.env("COOKIE_VALUE")
export const E2E_USER = {
  userId: "test",
  email: "test@open.gov.sg",
  contactNumber: "99999999",
}

export const E2E_EMAIL_ADMIN = {
  email: "admin@e2e.gov.sg",
} as const

export const E2E_EMAIL_COLLAB = {
  email: "collab@e2e.gov.sg",
} as const

export const E2E_EMAIL_TEST_SITE = {
  name: "e2e email test site",
  repo: "e2e-email-test-repo",
}

export const E2E_COOKIE = {
  Auth: {
    key: Cypress.env("COOKIE_NAME"),
    value: Cypress.env("COOKIE_VALUE"),
  },
  Site: { key: "site", value: E2E_EMAIL_TEST_SITE.name },
  EmailUserType: { key: "e2eUserType" },
  Email: { key: "email" },
}

export const E2E_USER_TYPE_COOKIE_KEY = "e2eUserType"
export const E2E_SITE_KEY = "site"
export const LOCAL_STORAGE_USERID_KEY = "userId"
export const LOCAL_STORAGE_USER_KEY = "user"
export const TEST_REPO_NAME: string | undefined = Cypress.env("TEST_REPO_NAME")
export const TEST_PRIMARY_COLOR = [255, 0, 0]

export enum Interceptors {
  GET = "@getRequest",
  POST = "@postRequest",
  DELETE = "@deleteRequest",
}

export const CMS_BASEURL: string | undefined = Cypress.env("BASEURL")

export const BASE_SEO_LINK = "www.open.gov.sg"

export const BACKEND_URL = Cypress.env("BACKEND_URL")
