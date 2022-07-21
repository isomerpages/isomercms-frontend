import waitForDom from "./waitForDom"

Cypress.Commands.add(
  "clickAndWait",
  { prevSubject: "element" },
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
