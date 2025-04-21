/** @type {import('next').NextConfig} */
const nextConfig = {
  // Next.js Dev Tools'u devre dışı bırakma
  experimental: {
    instrumentationHook: false, // Deneysel özellikleri devre dışı bırakır
  },
  // Geliştirme göstergelerini devre dışı bırakma
  devIndicators: false,
};

module.exports = nextConfig;
