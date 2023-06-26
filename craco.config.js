const merge = require("lodash/merge")

const customJestConfig = require("./jest.config.ts")

module.exports = {
  jest: {
    configure: (jestConfig) => {
      const newConfig = merge({}, jestConfig, customJestConfig)
      return newConfig
    },
  },
  webpack: {
    configure: (webpackConfig) => {
      webpackConfig.module.rules.push({
        test: /\.mjs$/,
        include: /node_modules/,
        type: "javascript/auto",
      })
      webpackConfig.resolve.fallback = {
        crypto: require.resolve("crypto-browserify"),
        stream: require.resolve("stream-browserify"),
      }
      return webpackConfig
    },
  },
}
