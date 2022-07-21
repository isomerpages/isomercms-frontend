import { defineConfig } from "cypress"

export default defineConfig({
  chromeWebSecurity: false,
  viewportHeight: 768,
  viewportWidth: 1366,
  projectId: "nxbty1",
  e2e: {
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    setupNodeEvents(on, config) {},
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
  },
})
