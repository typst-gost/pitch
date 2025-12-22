/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
    images: {
    unoptimized: true,
    remotePatterns: [],
  },
  poweredByHeader: false,
  compress: true,
  experimental: {
    optimizePackageImports: [
      'framer-motion',
      '@myriaddreamin/typst.ts'
    ],
  },

  // Tailwind + TS оптимизация сборки
  transpilePackages: ['@myriaddreamin/typst.ts'],
  typescript: {
    ignoreBuildErrors: false,
  },

}

export default nextConfig
