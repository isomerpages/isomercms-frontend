import path from "path"

import wp from "@cypress/webpack-preprocessor"
import { defineConfig } from "cypress"

export default defineConfig({
  chromeWebSecurity: false,
  viewportHeight: 768,
  viewportWidth: 1366,
  projectId: "nxbty1",
  numTestsKeptInMemory: 5,
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
                utils: path.resolve(__dirname, "src/utils"),
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
                      plugins: ["@babel/plugin-transform-runtime"],
                    },
                  },
                },
              ],
            },
            devServer: {
              client: {
                overlay: true,
              },
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
