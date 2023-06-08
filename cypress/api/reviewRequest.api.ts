import { Interceptors } from "../fixtures/constants"

import { E2E_EMAIL_SITE_API_URL } from "./constants"

/**
 * @precondition Assumes that the default interceptors are set up.
 * This creates a review request and waits for it using the default interceptors
 * Note that this creates a review request for the test site using the
 * session of the currently active user.
 */
export const createReviewRequest = async (
  title: string,
  reviewers: string[],
  description?: string
): Promise<void> => {
  cy.request("POST", `${E2E_EMAIL_SITE_API_URL}/review/request`, {
    reviewers,
    title,
    description,
  }).wait(Interceptors.POST)
}
