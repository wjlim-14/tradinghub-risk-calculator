/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['cryptologos.cc', 'assets.coingecko.com'],
  },
  env: {
    CUSTOM_KEY: process.env.CUSTOM_KEY,
  },
}

module.exports = nextConfig