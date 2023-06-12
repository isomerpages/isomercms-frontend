import { E2E_EMAIL_SITE_API_URL } from "./constants"

const BASE_URL = `${E2E_EMAIL_SITE_API_URL}/notifications`
/**
 * NOTE: This uses the **cookie's** site and email to determine which notifications to mark as read.
 */
export const markNotificationsAsRead = (): void => {
  cy.request("POST", BASE_URL)
}
