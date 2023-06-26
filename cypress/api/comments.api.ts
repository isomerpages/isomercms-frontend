import { E2E_EMAIL_SITE_API_URL } from "./constants"

const BASE_URL = `${E2E_EMAIL_SITE_API_URL}/review`

export const createComment = (requestNumber: number, comment: string): void => {
  cy.request("POST", `${BASE_URL}/${requestNumber}/comments`, {
    message: comment,
  })
}
