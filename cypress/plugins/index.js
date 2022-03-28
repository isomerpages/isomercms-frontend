/// <reference types="cypress" />
// ***********************************************************
// Source: https://github.com/cypress-io/cypress/issues/3262#issuecomment-753381051
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************
const path = require("path")

const webpackPreprocessor = require("@cypress/webpack-preprocessor")
const findWebpack = require("find-webpack")

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)
/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, _config) => {
  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config

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
}
