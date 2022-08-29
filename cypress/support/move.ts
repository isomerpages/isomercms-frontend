Cypress.Commands.add("verifyBreadcrumb", (alias, breadcrumbItems) => {
  const lastBreadcrumb = breadcrumbItems.pop()
  let breadcrumbRef = cy.get(alias)
  breadcrumbItems.forEach((curItem) => {
    breadcrumbRef = breadcrumbRef.contains(curItem).next().contains(">").next()
  })
  breadcrumbRef.contains(lastBreadcrumb)
})

Cypress.Commands.add(
  "getFirstSiblingAs",
  { prevSubject: "element" },
  (item, as) => {
    const wrapped = cy.wrap(item)
    return wrapped.parent().first().as(as)
  }
)
