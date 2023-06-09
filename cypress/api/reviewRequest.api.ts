import { E2E_EMAIL_SITE_API_URL } from "./constants"

const BASE_URL = `${E2E_EMAIL_SITE_API_URL}/review`

/**
 * This creates a review request and waits for it using the default interceptors
 * Note that this creates a review request for the test site using the
 * session of the currently active user.
 */
export const createReviewRequest = (
  title: string,
  reviewers: string[],
  description?: string
): Cypress.Chainable<number> => {
  return cy
    .request("POST", `${BASE_URL}/request`, {
      reviewers,
      title,
      description,
    })
    .then(({ body }) => body.pullRequestNumber)
}

export const listReviewRequests = (): Cypress.Chainable<{ id: number }[]> => {
  return cy
    .request("GET", `${BASE_URL}/summary`)
    .then(({ body }) => body.reviews)
}

export const closeReviewRequests = (): void => {
  listReviewRequests().then((reviewRequests) => {
    reviewRequests.forEach(({ id }) => {
      cy.request("DELETE", `${BASE_URL}/${id}`)
    })
  })
}

export const approveReviewRequest = (id: number): void => {
  cy.request("POST", `${BASE_URL}/${id}/approve`)
}
