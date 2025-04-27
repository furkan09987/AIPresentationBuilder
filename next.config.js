/** @type {import('next').NextConfig} */
const nextConfig = {
  // Geliştirme göstergelerini devre dışı bırakma
  devIndicators: false,
  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

module.exports = nextConfig;
