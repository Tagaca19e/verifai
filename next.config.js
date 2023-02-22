/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    protocols: ['https'],
    domains: ['tailwindui.com'],
  },
}

module.exports = nextConfig
