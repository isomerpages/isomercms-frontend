const path = require(`path`)
const webpack = require('@cypress/webpack-preprocessor')

module.exports = (on) => {
    const options = {
        webpackOptions: {
            resolve: {
                alias: {
                    "@root": path.resolve(__dirname, "../../"),
                    "@src": path.resolve(__dirname, "../../src"),
                    "@components": path.resolve(__dirname, "../../src/components"),
                    "@contexts": path.resolve(__dirname, "../../src/contexts"),
                    "@hooks": path.resolve(__dirname, "../../src/hooks"),
                    "@layouts": path.resolve(__dirname, "../../src/layouts"),
                    "@routing": path.resolve(__dirname, "../../src/routing"),
                    "@styles": path.resolve(__dirname, "../../src/styles"),
                    "@templates": path.resolve(__dirname, "../../src/templates"),
                    "@utils": path.resolve(__dirname, "../../src/utils"),
                }
            }
        },
        watchOptions: {},
    }
  on('file:preprocessor', webpack(options))
}