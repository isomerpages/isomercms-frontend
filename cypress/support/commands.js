import waitForDom from "./waitForDom"

Cypress.Commands.overwrite("visit", (originalFn, url, options) => {
  // originalFn is the existing `visit` command that you need to call
  // and it will receive whatever you pass in here.
  //
  // make sure to add a return here!
  originalFn(url, options)
  cy.wait(2 * 1000)
  return cy.get(`[data-testid="verify-user-modal"]`).should("not.exist")
})

Cypress.Commands.add(
  "clickAndWait",
  {
    prevSubject: true,
  },
  (subject, options) => {
    // the previous subject is automatically received
    // and the commands arguments are shifted

    // allow us to change the console method used
    cy.wrap(subject).click(options)
    waitForDom()

    // whatever we return becomes the new subject
    //
    // we don't want to change the subject so
    // we return whatever was passed in
    return cy.wrap(subject)
  }
)
