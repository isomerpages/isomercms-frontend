/* eslint-env node */
// This file is currently imported by craco in craco.config.js.
const esModules = ["react-markdown"].join("|")

/** @type {import('ts-jest/dist/types').InitialOptionsTsJest} */
module.exports = {
  preset: "ts-jest/presets/js-with-ts",
  setupFiles: ["<rootDir>/src/tests/TestDecoder.mock.ts"],
  testEnvironment: "jsdom",
  transformIgnorePatterns: [`node_modules/(?!${esModules})/`],
}
