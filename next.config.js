const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: false,
    esmExternals: true
  },
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === "production",
  },
  typescript: {
    ignoreBuildErrors: true
  },
  transpilePackages: [
    "@solana/spl-token",
    "@solana/web3.js",
    "@metaplex-foundation/mpl-token-metadata",
    "@solana/spl-token-group",
    "@solana/codecs-data-structures"
  ],
  images: {
    domains: [
      "pub-3626123a908346a7a8be8d9295f44e26.r2.dev",
      "cdn2.stablediffusionapi.com",
      "ipfs.io"
    ],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  webpack(config) {
    config.resolve.fallback = {
      fs: false,
      path: false,
      constants: false,
      stream: require.resolve("stream-browserify"),
      http: require.resolve("stream-http"),
      https: require.resolve("https-browserify"),
      crypto: require.resolve("crypto-browserify"),
      querystring: require.resolve("querystring-es3"),
      zlib: require.resolve("browserify-zlib"),
      vm: require.resolve("vm-browserify"),
    };
    config.module.rules.push({
      test: /\.m?js$/,
      type: "javascript/auto",
      resolve: {
        fullySpecified: false,
      },
    });
    return config;
  },
  async redirects() {
    return [];
  },
  async rewrites() {
    return [];
  },
};

module.exports = nextConfig;