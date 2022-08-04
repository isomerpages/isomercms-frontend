import { defineConfig } from "cypress"

export default defineConfig({
  chromeWebSecurity: false,
  viewportHeight: 768,
  viewportWidth: 1366,
  projectId: "nxbty1",

  // NOTE: Cypress keeps 50 tests in memory by default;
  // Unfortunately, this leads to OOM issues occasionally.
  // This has been reduced to 10 to help with the OOM issues.
  // Refer here: https://docs.cypress.io/guides/references/configuration#Global for details.
  numTestsKeptInMemory: 10,

  e2e: {
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
  },

  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
  },
})
