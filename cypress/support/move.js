/** Uses the first element in the breadcrumb to verify the structure of the breadcrumb against the provided array. \
 * The > connector is implicitly assumed and should not be passed in breadcrumb items.
 * @param {string} alias **NOTE** alias MUST be the full fledged (@...) alias of the first sibling
 * @param {[]string} breadcrumbItems The items within the breadcrumb - this must be a non-empty array
 */
Cypress.Commands.add("verifyBreadcrumb", (alias, breadcrumbItems) => {
  const lastBreadcrumb = breadcrumbItems.pop()
  let breadcrumbRef = cy.get(alias)
  breadcrumbItems.forEach((curItem) => {
    breadcrumbRef = breadcrumbRef.contains(curItem).next().contains(">").next()
  })
  breadcrumbRef.contains(lastBreadcrumb)
})

/**
 * Retrives the first sibling of the given element.
 * This command is to be chained off a previous command that yields an element (eg: cy.get().getFirstSiblingAs(...))
 * @param {string} as The alias that should be given to the first sibling
 */
Cypress.Commands.add(
  "getFirstSiblingAs",
  { prevSubject: "element" },
  (item, as) => {
    const wrapped = cy.wrap(item)
    return wrapped.parent().first().as(as)
  }
)
