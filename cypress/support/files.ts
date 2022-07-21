import "cypress-pipe"
/** Uses the immediate sibling of the context menu to retrieve the requested dropdown menu item \
 * and fire a click event on it
 * @param {string} alias **NOTE** alias MUST be the full fledged (@...) alias of the IMMEDIATE PRIOR sibling
 * @param {string} menuItemText The text within the menu item to select
 */
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
