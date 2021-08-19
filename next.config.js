const withPlugins = require('next-compose-plugins');
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: false,
})

module.exports = module.exports = withPlugins(
  [withBundleAnalyzer],
  {
    typescript: {
      ignoreBuildErrors: true,
    },
  }
)
