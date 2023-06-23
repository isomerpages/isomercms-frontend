import { BACKEND_URL } from "../fixtures/constants"

export const setCookieWithDomain = (name: string, value: string) => {
  const baseUrl = new URL(BACKEND_URL)
  cy.setCookie(name, value, { domain: baseUrl.host })
}
