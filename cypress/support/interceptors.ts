Cypress.Commands.add("setupDefaultInterceptors", () => {
  // NOTE: Interceptors are set up for requests hitting the network
  // This is because the network round trip time might be extremely long
  // and using the inbuilt assertion for buttons might timeout (>4s)
  // even when the request is successful.
  // This waits on the request till it succeeds or timeouts (>30s).
  // Refer here for default wait times: https://docs.cypress.io/guides/references/configuration#Timeouts
  // NOTE: This interceptors have to be kept in sync with the interceptors enum
  cy.intercept("POST", "/v2/**").as("postRequest")
  cy.intercept("DELETE", "/v2/**").as("deleteRequest")
  cy.intercept("GET", "/v2/**").as("getRequest")
})
