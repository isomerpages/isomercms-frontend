import path from "path"

import webpackPreprocessor from "@cypress/webpack-preprocessor"
import { defineConfig } from "cypress"
import findWebpack from "find-webpack"

export default defineConfig({
  chromeWebSecurity: false,
  viewportHeight: 768,
  viewportWidth: 1366,
  projectId: "nxbty1",

  e2e: {
    // `on` is used to hook into various events Cypress emits
    // `config` is the resolved Cypress config
    setupNodeEvents(on, _config) {
      // USE ABSOLUTE PATHS
      // find the Webpack config used by react-scripts - https://github.com/cypress-io/cypress/issues/3262#issuecomment-635550879
      const webpackOptions = findWebpack.getWebpackOptions()

      if (!webpackOptions) {
        throw new Error("Could not find Webpack in this project 😢")
      }

      const cleanOptions = {
        reactScripts: true,
      }

      findWebpack.cleanForCypress(cleanOptions, webpackOptions)

      const options = {
        webpackOptions,
        watchOptions: {},
      }

      // Define your alias(es) here:
      options.webpackOptions.resolve.alias["@fixtures"] = path.resolve(
        process.cwd(),
        "cypress",
        "fixtures"
      )

      on("file:preprocessor", webpackPreprocessor(options))
    },
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
  },

  component: {
    devServer: {
      framework: "create-react-app",
      bundler: "webpack",
    },
  },
})
