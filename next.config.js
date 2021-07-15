const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: false,
})

module.exports = (phase, defaultConfig) => {
  return withBundleAnalyzer(defaultConfig)
}
