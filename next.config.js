const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: true
})

module.exports = (phase, defaultConfig) => {
  return withBundleAnalyzer(defaultConfig)
}
