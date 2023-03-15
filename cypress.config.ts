import path from "path"

import wp from "@cypress/webpack-preprocessor"
import { defineConfig } from "cypress"

module.exports = defineConfig({
  chromeWebSecurity: false,
  viewportHeight: 768,
  viewportWidth: 1366,
  projectId: "nxbty1",
  e2e: {
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/e2e/**/*.{js,jsx,ts,tsx}",
    setupNodeEvents(on, config) {
      on(
        "file:preprocessor",
        wp({
          webpackOptions: {
            mode: "development",
            devtool: "eval-source-map",
            resolve: {
              alias: {
                utils: path.resolve(__dirname, "src/utils/index"),
              },
              extensions: [".ts", ".js", ".jsx", ".tsx"],
              fallback: {
                process: "process/browser",
              },
            },
            module: {
              rules: [
                {
                  test: /\.ts$/,
                  exclude: /node_modules/,
                  use: {
                    loader: "babel-loader",
                    options: {
                      presets: ["@babel/typescript"],
                      // presets: [["@babel/preset-env", { targets: "defaults" }]],
                      plugins: ["@babel/plugin-transform-runtime"],
                    },
                  },
                },
              ],
            },
          },
        })
      )
      config.baseUrl = process.env.CYPRESS_BASEURL || ""

      // IMPORTANT return the updated config object
      return config
    },
  },
})
