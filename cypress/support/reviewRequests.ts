Cypress.Commands.add("awaitReviewRequestSummary", () => {
  const RR_INTERCEPTOR = "getReviewRequest"
  cy.intercept("GET", "**/summary").as(RR_INTERCEPTOR)
  cy.wait(`@${RR_INTERCEPTOR}`)
})

Cypress.Commands.add("awaitDashboardLoad", () => {
  const DASHBOARD_INTERCEPTOR = "getCollaboratorDetails"
  cy.intercept("GET", "**/collaborators").as(DASHBOARD_INTERCEPTOR)
  cy.wait(`@${DASHBOARD_INTERCEPTOR}`)
})
