import { UnlinkedPageDto } from "../../src/types/pages"
import { BACKEND_URL } from "../fixtures/constants"

export const editUnlinkedPage = (
  pageName: string,
  pageContent: string,
  site: string
): void => {
  readUnlinkedPage(pageName, site).then(({ sha, content }) => {
    return cy.request(
      "POST",
      `${BACKEND_URL}/sites/${site}/pages/pages/${pageName}`,
      {
        content: {
          frontMatter: content.frontMatter,
          pageBody: pageContent,
        },
        sha,
      }
    )
  })
}

export const readUnlinkedPage = (
  pageName: string,
  site: string
): Cypress.Chainable<UnlinkedPageDto> => {
  return cy
    .request("GET", `${BACKEND_URL}/sites/${site}/pages/pages/${pageName}`)
    .then(({ body }) => body)
}
