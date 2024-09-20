// @ts-check

import withPWA from "next-pwa";

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  // Add other Next.js config options here
};

const withPWAConfig = withPWA({
  dest: "public",
  disable: process.env.NODE_ENV === "development",
  register: true,
  skipWaiting: true,
});

// @ts-ignore
export default withPWAConfig(nextConfig);
