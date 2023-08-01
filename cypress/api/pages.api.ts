import { DirectoryData } from "types/directory"

import { UnlinkedPageDto } from "../../src/types/pages"
import { BACKEND_URL } from "../fixtures/constants"

export const listCollectionPages = (
  site: string,
  collectionName: string
): Cypress.Chainable<DirectoryData[]> => {
  return cy
    .request(
      "GET",
      `${BACKEND_URL}/sites/${site}/collections/${collectionName}`
    )
    .then(({ body }) => body)
}

export const listUnlinkedPages = (
  site: string
): Cypress.Chainable<DirectoryData[]> => {
  return cy
    .request("GET", `${BACKEND_URL}/sites/${site}/pages`)
    .then(({ body }) => body)
}

export const addCollectionPage = (
  pageName: string,
  collectionName: string,
  title: string,
  permalink: string,
  pageContent: string,
  site: string
): void => {
  cy.request(
    "POST",
    `${BACKEND_URL}/sites/${site}/collections/${collectionName}/pages`,
    {
      content: {
        frontMatter: {
          title,
          permalink,
        },
        pageBody: pageContent,
      },
      newFileName: pageName,
    }
  )
}

export const addUnlinkedPage = (
  pageName: string,
  title: string,
  permalink: string,
  pageContent: string,
  site: string
): void => {
  cy.request("POST", `${BACKEND_URL}/sites/${site}/pages/pages`, {
    content: {
      frontMatter: {
        title,
        permalink,
      },
      pageBody: pageContent,
    },
    newFileName: pageName,
  })
}

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

export const readCollectionPage = (
  pageName: string,
  collectionName: string,
  site: string
): Cypress.Chainable<UnlinkedPageDto> => {
  return cy
    .request(
      "GET",
      `${BACKEND_URL}/sites/${site}/collections/${collectionName}/pages/${pageName}`
    )
    .then(({ body }) => body)
}

export const deleteUnlinkedPage = (pageName: string, site: string): void => {
  readUnlinkedPage(pageName, site).then(({ sha }) => {
    return cy.request(
      "DELETE",
      `${BACKEND_URL}/sites/${site}/pages/pages/${pageName}`,
      {
        sha,
      }
    )
  })
}

export const deleteCollectionPage = (
  pageName: string,
  collectionName: string,
  site: string
): void => {
  readCollectionPage(pageName, collectionName, site).then(({ sha }) => {
    return cy.request(
      "DELETE",
      `${BACKEND_URL}/sites/${site}/collections/${collectionName}/pages/${pageName}`,
      {
        sha,
      }
    )
  })
}

export const renameUnlinkedPage = (
  pageName: string,
  newPageName: string,
  site: string
): void => {
  readUnlinkedPage(pageName, site).then(({ sha, content }) => {
    return cy.request(
      "POST",
      `${BACKEND_URL}/sites/${site}/pages/pages/${pageName}`,
      {
        content,
        sha,
        newFileName: newPageName,
      }
    )
  })
}

export const moveUnlinkedPage = (
  pageName: string,
  targetCollectionName: string,
  site: string
): void => {
  cy.request("POST", `${BACKEND_URL}/sites/${site}/pages/move`, {
    target: {
      collectionName: targetCollectionName,
    },
    items: [
      {
        name: pageName,
        type: "file",
      },
    ],
  })
}
