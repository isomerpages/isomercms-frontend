Cypress.Commands.add("uploadImage", (image_title, image_path, disableAction) => {
  cy.contains('Upload new image').click()
    .get('#file-upload')
    .attachFile(image_path)
  
  cy.get('#file-name').clear().type(image_title)  
  if (!disableAction) cy.get('button').contains(/^Upload$/).click() // necessary as multiple buttons containing Upload on page
})

Cypress.Commands.add("renameImage", (image_title, new_image_title, disableAction) => {
  cy.contains(image_title).click()
  cy.wait(1000) // Wait for SHA to be retrieved
  cy.get('#file-name').clear().type(new_image_title)  
  if (!disableAction) cy.get('button').contains('Save').click()
})

Cypress.Commands.add("deleteImage", (image_title, disableAction) => {
  cy.contains(image_title).click()
  // Wait for SHA to be retrieved
  cy.wait(1000)
  cy.get('button').contains('Delete').click()
  if (!disableAction) cy.get('#delete-confirmation').click()
})