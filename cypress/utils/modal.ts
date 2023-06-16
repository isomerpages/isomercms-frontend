export const closeModal = (): void => {
  cy.get('button[aria-label="Close"][class^="chakra-modal"]').click()
}
