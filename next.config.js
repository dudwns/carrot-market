/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ["videodelivery.net", "firebasestorage.googleapis.com"],
  },
};

module.exports = nextConfig;
