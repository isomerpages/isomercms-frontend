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
  CMS_BASEURL,
  BACKEND_URL,
  E2E_EMAIL_CONTRI,
  E2E_EMAIL_ADMIN_2,
} from "../fixtures/constants"
import { EmailUserTypes, USER_TYPES } from "../fixtures/users"
import { setCookieWithDomain } from "../utils/cookies"

Cypress.Commands.add("setGithubSessionDefaults", () => {
  setCookieWithDomain(COOKIE_NAME, COOKIE_VALUE)
  setCookieWithDomain(E2E_USER_TYPE_COOKIE_KEY, USER_TYPES.Github)
  window.localStorage.setItem(LOCAL_STORAGE_USER_KEY, JSON.stringify(E2E_USER))
  window.localStorage.setItem(LOCAL_STORAGE_USERID_KEY, E2E_USER.userId)
})

const getEmailFromUserType = (userType: EmailUserTypes) => {
  switch (userType) {
    case USER_TYPES.Email.Admin:
      return E2E_EMAIL_ADMIN.email
    case USER_TYPES.Email.Admin2:
      return E2E_EMAIL_ADMIN_2.email
    default:
      return E2E_EMAIL_CONTRI.email
  }
}

Cypress.Commands.add("setEmailSessionDefaults", (userType: EmailUserTypes) => {
  setCookieWithDomain(COOKIE_NAME, COOKIE_VALUE)
  setCookieWithDomain(E2E_USER_TYPE_COOKIE_KEY, userType)
  setCookieWithDomain(E2E_SITE_KEY, E2E_EMAIL_TEST_SITE.name)
  setCookieWithDomain(E2E_COOKIE.Email.key, getEmailFromUserType(userType))
  setCookieWithDomain(E2E_COOKIE.Site.key, E2E_COOKIE.Site.value)
})

Cypress.Commands.add(
  "createEmailUser",
  (
    email: string,
    userType: EmailUserTypes,
    initialUserType: EmailUserTypes,
    site = ""
  ) => {
    cy.clearCookies()
    setCookieWithDomain(E2E_COOKIE.Site.key, site)
    setCookieWithDomain(COOKIE_NAME, COOKIE_VALUE)
    setCookieWithDomain(E2E_COOKIE.Auth.key, E2E_COOKIE.Auth.value)
    setCookieWithDomain(E2E_COOKIE.EmailUserType.key, userType)
    setCookieWithDomain(E2E_COOKIE.Email.key, email)
    cy.request("GET", `${BACKEND_URL}/auth/whoami`)

    cy.setEmailSessionDefaults(initialUserType)
    cy.visit(`${CMS_BASEURL}/sites/${E2E_EMAIL_TEST_SITE.repo}/dashboard`)
  }
)
