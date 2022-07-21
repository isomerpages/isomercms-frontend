import { defineConfig } from "cypress"

export default defineConfig({
  chromeWebSecurity: false,
  viewportHeight: 768,
  viewportWidth: 1366,
  projectId: "nxbty1",

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
