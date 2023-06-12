// NOTE: This file exports certain auth errors that we want to ignore.
// This is because cypress ends the test on network errors,
// some of which are exported in the flow of our tests.
// One example is when we want to test authorization flows, where 404/403s
// might be expected.
export const ignoreDuplicateError = (): ReturnType<typeof cy["on"]> =>
  cy.on("uncaught:exception", (err) => !err.message.includes("409"))

export const ignoreNotFoundError = (): ReturnType<typeof cy["on"]> =>
  cy.on("uncaught:exception", (err) => !err.message.includes("404"))

export const ignoreAuthError = (): ReturnType<typeof cy["on"]> =>
  cy.on("uncaught:exception", (err) => !err.message.includes("403"))
