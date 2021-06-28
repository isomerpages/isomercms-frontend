import "cypress-pipe"

const click = ($el) => $el.click()
const CUSTOM_TIMEOUT = 30000 // 30 seconds

Cypress.Commands.add("uploadMedia", (mediaTitle, mediaPath, disableAction) => {
  cy.contains(`Upload new`).click().get("#file-upload").attachFile(mediaPath)

  cy.get("#file-name").clear().type(mediaTitle)
  if (!disableAction)
    cy.get("button")
      .contains(/^Upload$/)
      .click() // necessary as multiple buttons containing Upload on page
})

Cypress.Commands.add(
  "renameMedia",
  (mediaTitle, newMediaTitle, disableAction) => {
    cy.contains(mediaTitle).click()
    cy.get("#file-name").clear().type(newMediaTitle)
    if (!disableAction) cy.get("button").contains("Save").click()
  }
)

Cypress.Commands.add("moveMedia", (mediaTitle, newMediaFolder) => {
  cy.get(`[id^="${mediaTitle}-settings-"]`).click()
  cy.contains("Move to").click()
  if (newMediaFolder) {
    cy.get(`[id^="${newMediaFolder}-1"]`, { timeout: CUSTOM_TIMEOUT })
      .should("have.length.gte", 1)
      .should("be.visible")
      .first()
      .click()
  } else {
    cy.get(`[id^="breadcrumbItem-0"]`, { timeout: CUSTOM_TIMEOUT })
      .should("be.visible")
      // breadcrumb elements in FileMoveMenuDropdown are flaky, so we need to
      // use cypress-pipe
      .pipe(click)
      .should(($el) => {
        expect($el).to.not.exist
      })
  }
  cy.contains("button", "Move Here").click({ scrollBehavior: false }) // necessary because it will otherwise scroll to top of page
  cy.contains("button", "Continue").click()
})

Cypress.Commands.add("deleteMedia", (mediaTitle, disableAction) => {
  cy.get(`[id^="${mediaTitle}-settings-"]`).should("exist").click()
  cy.contains("Delete").click()
  if (!disableAction) cy.get("#modal-delete").click()
})
