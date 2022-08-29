import "cypress-pipe"

Cypress.Commands.add("clickContextMenuItem", (alias, menuItemText) => {
  // NOTE: Context menu is absolutely positioned so we get the sibling first using the alias
  cy.get(alias).next().click()
  // NOTE: Cypress thinks this element is still hidden after it's being clicked
  // We pass the force option to override this as it has been clicked above
  // and existence is guaranteed.
  cy.get(alias)
    .parent()
    .find("div")
    .contains("a", menuItemText)
    .click({ force: true })
})
