import { withHighlightConfig } from '@highlight-run/next/config'

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  experimental: {
    instrumentationHook: true,
  },
  webpack(config, options) {
    if (options.isServer) {
      config.ignoreWarnings = [{ module: /highlight-(run\/)?node/ }]
    }

    return config
  },
}

export default withHighlightConfig(nextConfig)
