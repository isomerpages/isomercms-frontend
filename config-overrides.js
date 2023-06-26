module.exports = function override(config, _env) {
  // do stuff with the webpack config...

  config.resolve.fallback = {
    crypto: require.resolve("crypto-browserify"),
    stream: require.resolve("stream-browserify"),
  }

  return config
}
