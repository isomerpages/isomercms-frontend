import { APIRequestContext, BrowserContext } from "@playwright/test"

import {
  BACKEND_URL,
  COOKIE_NAME,
  COOKIE_VALUE,
  E2E_COOKIE,
  E2E_EMAIL_ADMIN,
  E2E_EMAIL_COLLAB,
  E2E_EMAIL_TEST_SITE,
  E2E_SITE_KEY,
  E2E_USER_TYPE_COOKIE_KEY,
} from "../fixtures/constants"
import { EmailUserTypes } from "../fixtures/users"

const setCookieWithDomain = (
  context: BrowserContext,
  name: string,
  value: string
) => {
  context.addCookies([
    {
      name,
      value,
      url: BACKEND_URL,
    },
  ])
}

export const setEmailSessionDefaults = (
  context: BrowserContext,
  userType: EmailUserTypes
) => {
  setCookieWithDomain(context, COOKIE_NAME, COOKIE_VALUE)
  setCookieWithDomain(context, E2E_USER_TYPE_COOKIE_KEY, userType)
  setCookieWithDomain(context, E2E_SITE_KEY, E2E_EMAIL_TEST_SITE.name)
  setCookieWithDomain(
    context,
    E2E_COOKIE.Email.key,
    userType === "Email admin" ? E2E_EMAIL_ADMIN.email : E2E_EMAIL_COLLAB.email
  )
  setCookieWithDomain(context, E2E_COOKIE.Site.key, E2E_COOKIE.Site.value)
}

export const actAsEmailUser = (
  context: BrowserContext,
  apiContext: APIRequestContext,
  email: string,
  userType: EmailUserTypes,
  site = ""
) => {
  setCookieWithDomain(context, E2E_COOKIE.Site.key, site)
  setCookieWithDomain(context, COOKIE_NAME, COOKIE_VALUE)
  setCookieWithDomain(context, E2E_COOKIE.Auth.key, E2E_COOKIE.Auth.value)
  setCookieWithDomain(context, E2E_COOKIE.EmailUserType.key, userType)
  setCookieWithDomain(context, E2E_COOKIE.Email.key, email)
  apiContext.get(`/auth/whoami`)
}
