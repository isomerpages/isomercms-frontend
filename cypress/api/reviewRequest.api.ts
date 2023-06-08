import {
  BACKEND_URL,
  E2E_EMAIL_TEST_SITE,
  Interceptors,
} from "../fixtures/constants"

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
  cy.request(
    "POST",
    `${BACKEND_URL}/sites/${E2E_EMAIL_TEST_SITE.repo}/request`,
    {
      reviewers,
      title,
      description,
    }
  ).wait(Interceptors.POST)
}
