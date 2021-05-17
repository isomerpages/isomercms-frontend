Cypress.Commands.add("uploadMedia", (mediaTitle, mediaPath, disableAction) => {
  cy.contains(`Upload new`).click()
    .get('#file-upload')
    .attachFile(mediaPath)
  
  cy.get('#file-name').clear().type(mediaTitle)  
  if (!disableAction) cy.get('button').contains(/^Upload$/).click() // necessary as multiple buttons containing Upload on page
})

Cypress.Commands.add("renameMedia", (mediaTitle, newMediaTitle, disableAction) => {
  cy.contains(mediaTitle).click()
  cy.wait(1000) // Wait for SHA to be retrieved
  cy.get('#file-name').clear().type(newMediaTitle)  
  if (!disableAction) cy.get('button').contains('Save').click()
})

Cypress.Commands.add("deleteMedia", (mediaTitle, disableAction) => {
  cy.contains(mediaTitle).click()
  cy.wait(1000) // Wait for SHA to be retrieved
  cy.get('button').contains('Delete').click()
  if (!disableAction) cy.get('#delete-confirmation').click()
})