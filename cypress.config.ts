import { defineConfig } from "cypress"

export default defineConfig({
  chromeWebSecurity: false,
  viewportHeight: 768,
  viewportWidth: 1366,
  projectId: "nxbty1",

  // NOTE: Cypress keeps 50 tests in memory by default;
  // Unfortunately, this leads to OOM issues occasionally.
  // This has been reduced to 5 to help with the OOM issues.
  // Refer here: https://docs.cypress.io/guides/references/configuration#Global for details.
  numTestsKeptInMemory: 5,

  e2e: {
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
    setupNodeEvents: (on, config) => {
      // NOTE: Disabling as cypress docs give this form
      // Refer here: https://docs.cypress.io/api/plugins/configuration-api#Usage
      // eslint-disable-next-line no-param-reassign
      config.baseUrl = process.env.CYPRESS_BASEURL || ""

      // IMPORTANT return the updated config object
      return config
    },
  },

  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
  },
})
